#!/usr/bin/env node

/**
 * Firebase MCP (Model Context Protocol) Server for Funtroo
 * Controls Firebase Firestore, Storage, Auth, and Hosting Deployments via MCP.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { exec } = require('child_process');

let admin;
try {
  admin = require('firebase-admin');
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'funtrooo',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'funtrooo.firebasestorage.app'
    });
  }
} catch (err) {
  console.error('[Firebase MCP] Admin SDK notice:', err.message);
}

const server = new Server(
  {
    name: 'firebase-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'firebase_deploy',
        description: 'Deploy Hosting, Firestore rules, and Storage rules to Firebase production (funtrooo project).',
        inputSchema: {
          type: 'object',
          properties: {
            only: {
              type: 'string',
              description: 'Optional target to deploy (e.g. "hosting", "firestore", "storage"). Default deploys all.',
            },
          },
        },
      },
      {
        name: 'firebase_firestore_query',
        description: 'Query documents from a Firestore collection (e.g., products, customers, orders, otps, blogs).',
        inputSchema: {
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              description: 'Name of the Firestore collection (e.g. "products", "customers", "orders")',
            },
            limitCount: {
              type: 'number',
              description: 'Maximum number of documents to return (default 20)',
            },
          },
          required: ['collection'],
        },
      },
      {
        name: 'firebase_firestore_get_doc',
        description: 'Fetch a single document from a Firestore collection by ID or slug.',
        inputSchema: {
          type: 'object',
          properties: {
            collection: { type: 'string' },
            docId: { type: 'string' },
          },
          required: ['collection', 'docId'],
        },
      },
      {
        name: 'firebase_firestore_set_doc',
        description: 'Create or update a document in a Firestore collection.',
        inputSchema: {
          type: 'object',
          properties: {
            collection: { type: 'string' },
            docId: { type: 'string' },
            data: { type: 'object', description: 'JSON object containing document fields' },
          },
          required: ['collection', 'docId', 'data'],
        },
      },
      {
        name: 'firebase_firestore_delete_doc',
        description: 'Delete a document from a Firestore collection.',
        inputSchema: {
          type: 'object',
          properties: {
            collection: { type: 'string' },
            docId: { type: 'string' },
          },
          required: ['collection', 'docId'],
        },
      },
      {
        name: 'firebase_status',
        description: 'Check active Firebase connection, project ID, and deployment status.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Helper exec async
function runCmd(cmd, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (err, stdout, stderr) => {
      if (err) {
        return resolve({ success: false, output: stdout + '\n' + stderr, error: err.message });
      }
      resolve({ success: true, output: stdout + '\n' + stderr });
    });
  });
}

// Tool Call Handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'firebase_deploy') {
      const targetFlag = args?.only ? `--only ${args.only}` : '';
      const result = await runCmd(`npx -y firebase-tools deploy --project funtrooo ${targetFlag}`);
      return {
        content: [
          {
            type: 'text',
            text: result.success
              ? `🚀 Firebase Deploy Success!\n\n${result.output}`
              : `❌ Firebase Deploy Error:\n\n${result.output}`,
          },
        ],
      };
    }

    if (name === 'firebase_status') {
      const result = await runCmd('npx -y firebase-tools projects:list');
      return {
        content: [
          {
            type: 'text',
            text: `🔥 Firebase Status:\nProject ID: funtrooo\nHosting URL: https://funtrooo.web.app\n\nProjects List Output:\n${result.output}`,
          },
        ],
      };
    }

    if (name === 'firebase_firestore_query') {
      if (!admin || !admin.apps.length) {
        if (args.collection === 'products') {
          const { PRODUCTS_DATA } = require('../lib/products-data');
          return {
            content: [{ type: 'text', text: JSON.stringify(PRODUCTS_DATA.slice(0, args.limitCount || 20), null, 2) }],
          };
        }
        return { content: [{ type: 'text', text: `Firestore Admin SDK not authenticated. Collection: ${args.collection}` }] };
      }
      const db = admin.firestore();
      const snap = await db.collection(args.collection).limit(args.limitCount || 20).get();
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return {
        content: [{ type: 'text', text: JSON.stringify(docs, null, 2) }],
      };
    }

    if (name === 'firebase_firestore_get_doc') {
      if (admin && admin.apps.length) {
        const db = admin.firestore();
        const docSnap = await db.collection(args.collection).doc(args.docId).get();
        if (docSnap.exists) {
          return { content: [{ type: 'text', text: JSON.stringify({ id: docSnap.id, ...docSnap.data() }, null, 2) }] };
        }
      }
      if (args.collection === 'products') {
        const { PRODUCTS_DATA } = require('../lib/products-data');
        const found = PRODUCTS_DATA.find(p => p.id === args.docId || p.slug === args.docId);
        if (found) return { content: [{ type: 'text', text: JSON.stringify(found, null, 2) }] };
      }
      return { content: [{ type: 'text', text: `Document ${args.docId} not found in ${args.collection}.` }] };
    }

    if (name === 'firebase_firestore_set_doc') {
      if (!admin || !admin.apps.length) {
        return { content: [{ type: 'text', text: `Error: Firebase Admin SDK credentials required to write document.` }] };
      }
      const db = admin.firestore();
      await db.collection(args.collection).doc(args.docId).set(args.data, { merge: true });
      return {
        content: [{ type: 'text', text: `✅ Document ${args.docId} in ${args.collection} successfully set/updated.` }],
      };
    }

    if (name === 'firebase_firestore_delete_doc') {
      if (!admin || !admin.apps.length) {
        return { content: [{ type: 'text', text: `Error: Firebase Admin SDK credentials required to delete document.` }] };
      }
      const db = admin.firestore();
      await db.collection(args.collection).doc(args.docId).delete();
      return {
        content: [{ type: 'text', text: `🗑️ Document ${args.docId} deleted from ${args.collection}.` }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error executing ${name}: ${error.message}` }],
      isError: true,
    };
  }
});

// Start Stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[Firebase MCP Server] Running on stdio transport.');
}

main().catch((err) => {
  console.error('[Firebase MCP Server] Fatal error:', err);
  process.exit(1);
});
