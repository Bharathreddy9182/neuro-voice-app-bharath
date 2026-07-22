const https = require('https');
const http = require('http');

class DeploymentVerifier {
  static async verifyDeployment(url) {
    console.log(`DeploymentVerifier: Verifying deployment readiness for [${url}]...`);
    
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      
      const req = client.get(url, (res) => {
        console.log(`DeploymentVerifier: Received HTTP Status ${res.statusCode} from ${url}`);
        if (res.statusCode >= 200 && res.statusCode < 400) {
          console.log('✅ Deployment Verification SUCCESS: LIVE application URL is accessible and healthy.');
          resolve(true);
        } else {
          console.error(`❌ Deployment Verification FAILED: Live URL returned status ${res.statusCode}`);
          resolve(false);
        }
      });

      req.on('error', (err) => {
        console.error(`❌ Deployment Verification FAILED: Error reaching ${url} - ${err.message}`);
        resolve(false);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        console.error('❌ Deployment Verification FAILED: Request timed out.');
        resolve(false);
      });
    });
  }
}

module.exports = DeploymentVerifier;
