/**
 * vlayer Prover Client
 * Generates ZK-TLS proofs for GitHub actions
 */

const VLAYER_API_URL = process.env.VLAYER_API_URL || 'https://api.vlayer.io';

// Get credentials from environment or window
const getVlayerCredentials = () => {
  if (typeof window !== 'undefined' && window.VLAYER_CLIENT_ID) {
    return {
      clientId: window.VLAYER_CLIENT_ID,
      clientSecret: window.VLAYER_CLIENT_SECRET
    };
  }
  return {
    clientId: process.env.VLAYER_CLIENT_ID,
    clientSecret: process.env.VLAYER_CLIENT_SECRET
  };
};

/**
 * Prove a GitHub action using vlayer ZK-TLS
 * @param {string} action - The action type (star, fork, merge, comment, issue)
 * @param {string} repoOwner - Repository owner
 * @param {string} repoName - Repository name
 * @param {number} prOrIssueNumber - PR or issue number (optional)
 * @returns {Promise<{success: boolean, proofId?: string, error?: string}>}
 */
async function proveGitHubAction(action, repoOwner, repoName, prOrIssueNumber = null) {
  try {
    // Construct the GitHub API URL based on action
    let githubUrl = '';
    switch (action.toLowerCase()) {
      case 'star':
        githubUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
        break;
      case 'fork':
        githubUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/forks`;
        break;
      case 'merge':
      case 'mergepr':
        if (!prOrIssueNumber) {
          throw new Error('PR number required for merge action');
        }
        githubUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${prOrIssueNumber}`;
        break;
      case 'comment':
        if (!prOrIssueNumber) {
          throw new Error('Issue/PR number required for comment action');
        }
        githubUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${prOrIssueNumber}/comments`;
        break;
      case 'issue':
      case 'openissue':
        githubUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/issues`;
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Get authentication token
    const credentials = getVlayerCredentials();
    let authHeader = '';
    
    if (credentials.clientId && credentials.clientSecret) {
      // In browser, we'll need to get token from server or use a JWT library
      // For now, we'll pass credentials to be handled server-side
      // In production, generate JWT token here or fetch from backend
      authHeader = `Bearer ${credentials.clientId}`; // Placeholder
    }

    // Call vlayer API to generate proof
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${VLAYER_API_URL}/prove`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        url: githubUrl,
        action: action,
        repoOwner: repoOwner,
        repoName: repoName,
        prOrIssueNumber: prOrIssueNumber,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate proof');
    }

    const result = await response.json();
    
    return {
      success: true,
      proofId: result.proofId,
    };
  } catch (error) {
    console.error('Error generating proof:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}

/**
 * Verify a proof ID
 * @param {string} proofId - The proof ID to verify
 * @returns {Promise<{success: boolean, verified?: boolean, error?: string}>}
 */
async function verifyProof(proofId) {
  try {
    const credentials = getVlayerCredentials();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (credentials.clientId && credentials.clientSecret) {
      headers['Authorization'] = `Bearer ${credentials.clientId}`; // Placeholder - use JWT in production
    }

    const response = await fetch(`${VLAYER_API_URL}/verify/${proofId}`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error('Failed to verify proof');
    }

    const result = await response.json();
    
    return {
      success: true,
      verified: result.verified || false,
    };
  } catch (error) {
    console.error('Error verifying proof:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.proveGitHubAction = proveGitHubAction;
  window.verifyProof = verifyProof;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    proveGitHubAction,
    verifyProof,
  };
}

