module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/The-Ghost-Operator/vouch-github/app/api/web-proof/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$The$2d$Ghost$2d$Operator$2f$vouch$2d$github$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/The-Ghost-Operator/vouch-github/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
// Simple file-based storage (replace with database in production)
const PROOFS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'proofs.json');
function getProofs() {
    try {
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(PROOFS_FILE)) {
            const data = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(PROOFS_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading proofs:', error);
    }
    return [];
}
function saveProof(proof) {
    try {
        const proofs = getProofs();
        const existingIndex = proofs.findIndex((p)=>p.proofId === proof.proofId);
        if (existingIndex >= 0) {
            proofs[existingIndex] = proof;
        } else {
            proofs.push(proof);
        }
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(PROOFS_FILE, JSON.stringify(proofs, null, 2));
    } catch (error) {
        console.error('Error saving proof:', error);
    }
}
async function POST(request) {
    try {
        const payload = await request.json();
        console.log('Received webhook payload:', JSON.stringify(payload, null, 2));
        // Extract requestId from payload
        const requestId = payload.requestId || payload.request_id || null;
        const proofId = payload.proofId || payload.proof_id || `proof-${Date.now()}`;
        // Determine action type from payload
        let action;
        if (payload.inputs) {
            if (payload.inputs.action === 'merge' || payload.inputs.pr_number) {
                action = payload.inputs.action === 'merge' ? 'merge' : 'pull_request';
            }
        }
        // Store the proof
        const proof = {
            proofId,
            requestId,
            payload,
            verified: true,
            action,
            createdAt: new Date().toISOString()
        };
        saveProof(proof);
        console.log(`✅ Proof stored: ${proofId} (requestId: ${requestId})`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$The$2d$Ghost$2d$Operator$2f$vouch$2d$github$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            proofId
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error storing web proof:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$The$2d$Ghost$2d$Operator$2f$vouch$2d$github$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to store web proof'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const requestId = searchParams.get('requestId');
        if (!requestId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$The$2d$Ghost$2d$Operator$2f$vouch$2d$github$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'requestId is required'
            }, {
                status: 400
            });
        }
        const proofs = getProofs();
        const proof = proofs.find((p)=>p.requestId === requestId);
        if (!proof) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$The$2d$Ghost$2d$Operator$2f$vouch$2d$github$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(proof, {
                status: 200
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$The$2d$Ghost$2d$Operator$2f$vouch$2d$github$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Proof not found'
        }, {
            status: 404
        });
    } catch (error) {
        console.error('Error retrieving proof:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$The$2d$Ghost$2d$Operator$2f$vouch$2d$github$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to retrieve proof'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6d658171._.js.map