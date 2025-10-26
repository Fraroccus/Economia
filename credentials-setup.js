// Script to auto-generate credentials
const { execSync } = require('child_process');

console.log('Setting up Android credentials automatically...');

try {
  // This will trigger credential generation via EAS
  execSync('eas credentials', {
    stdio: 'inherit',
    input: 'Android\n1\nY\n'
  });
  console.log('Credentials setup complete!');
} catch (error) {
  console.error('Error:', error.message);
}
