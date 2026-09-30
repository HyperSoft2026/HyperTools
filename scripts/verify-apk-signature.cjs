/**
 * HyperTools APK Release Signature & Metadata Verifier
 * 
 * Safely verifies that the compiled Release APK is signed with the
 * official permanent release keystore before artifact upload.
 * 
 * Target Certificate SHA-1: 75:00:C5:D4:08:52:76:EC:DE:81:56:E8:DF:A2:BC:BB:B9:B8:8B:3C
 * Target Package ID: com.hypersoft.hypertools
 * Target Version: 1.0.2 (code: 3)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const EXPECTED_SHA1 = "75:00:C5:D4:08:52:76:EC:DE:81:56:E8:DF:A2:BC:BB:B9:B8:8B:3C";
const EXPECTED_PACKAGE = "com.hypersoft.hypertools";
const EXPECTED_VERSION_NAME = "1.0.2";
const EXPECTED_VERSION_CODE = 3;

function findReleaseApk(dir) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory not found: ${dir}`);
  }
  const files = fs.readdirSync(dir);
  const apkFiles = files.filter(f => f.endsWith('.apk') && !f.includes('-unsigned'));
  if (apkFiles.length === 0) {
    throw new Error(`No signed APK found in: ${dir}`);
  }
  return path.join(dir, apkFiles[0]);
}

function extractApkCertificate(apkPath) {
  const fd = fs.openSync(apkPath, 'r');
  const stat = fs.fstatSync(fd);
  const size = stat.size;

  const bufSize = Math.min(size, 65536);
  const buf = Buffer.alloc(bufSize);
  fs.readSync(fd, buf, 0, bufSize, size - bufSize);

  let eocdOffset = -1;
  for (let i = bufSize - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = size - bufSize + i;
      break;
    }
  }
  if (eocdOffset === -1) {
    fs.closeSync(fd);
    throw new Error('EOCD (End of Central Directory) record not found in APK file.');
  }

  const eocd = Buffer.alloc(22);
  fs.readSync(fd, eocd, 0, 22, eocdOffset);
  const cdOffset = eocd.readUInt32LE(16);

  const footer = Buffer.alloc(24);
  fs.readSync(fd, footer, 0, 24, cdOffset - 24);
  const magic = footer.slice(8).toString('utf8');
  if (magic !== 'APK Sig Block 42') {
    fs.closeSync(fd);
    throw new Error('APK Signing Block magic header not found. APK may not be signed with Scheme v2/v3.');
  }

  const blockSize = Number(footer.readBigUInt64LE(0));
  const blockOffset = cdOffset - blockSize - 8;
  const block = Buffer.alloc(blockSize);
  fs.readSync(fd, block, 0, blockSize, blockOffset + 8);
  fs.closeSync(fd);

  let pos = 0;
  while (pos < blockSize - 24) {
    const len = Number(block.readBigUInt64LE(pos));
    pos += 8;
    const id = block.readUInt32LE(pos);
    pos += 4;
    const value = block.slice(pos, pos + len - 4);
    pos += len - 4;

    // 0x7109871a = APK Signature Scheme v2, 0xf05368c0 = Scheme v3
    if (id === 0x7109871a || id === 0xf05368c0) {
      let vPos = 0;
      vPos += 4; // signers sequence length
      vPos += 4; // signer length
      vPos += 4; // signedData sequence length
      const digestsLen = value.readUInt32LE(vPos);
      vPos += 4 + digestsLen; // skip digests
      vPos += 4; // certs sequence length
      const certLen = value.readUInt32LE(vPos);
      vPos += 4;
      const cert = value.slice(vPos, vPos + certLen);

      const rawSha1 = crypto.createHash('sha1').update(cert).digest('hex').toUpperCase();
      const formattedSha1 = rawSha1.match(/.{1,2}/g).join(':');
      return formattedSha1;
    }
  }

  throw new Error('No v2 or v3 certificate found in APK Signing Block.');
}

function verifyGradleConfig() {
  const buildGradlePath = path.resolve(__dirname, '../android/app/build.gradle');
  if (!fs.existsSync(buildGradlePath)) {
    throw new Error('build.gradle not found at ' + buildGradlePath);
  }
  const content = fs.readFileSync(buildGradlePath, 'utf8');

  if (!content.includes(`applicationId "${EXPECTED_PACKAGE}"`)) {
    throw new Error(`build.gradle does not match expected package ID: ${EXPECTED_PACKAGE}`);
  }
  if (!content.includes(`versionName "${EXPECTED_VERSION_NAME}"`)) {
    throw new Error(`build.gradle does not match expected versionName: ${EXPECTED_VERSION_NAME}`);
  }
  if (!content.includes(`versionCode ${EXPECTED_VERSION_CODE}`)) {
    throw new Error(`build.gradle does not match expected versionCode: ${EXPECTED_VERSION_CODE}`);
  }
}

function main() {
  console.log('=====================================================');
  console.log('HyperTools Release APK Verification');
  console.log('=====================================================');

  // Verify Gradle Config
  verifyGradleConfig();
  console.log(`[PASS] Configured Package ID   : ${EXPECTED_PACKAGE}`);
  console.log(`[PASS] Configured Version Name : ${EXPECTED_VERSION_NAME}`);
  console.log(`[PASS] Configured Version Code : ${EXPECTED_VERSION_CODE}`);

  // Locate APK
  const apkDir = path.resolve(__dirname, '../android/app/build/outputs/apk/release');
  let apkPath;
  try {
    apkPath = findReleaseApk(apkDir);
  } catch (err) {
    console.error(`::error::Failed to locate Release APK: ${err.message}`);
    process.exit(1);
  }

  const filename = path.basename(apkPath);
  console.log(`[PASS] Release APK Located     : ${filename}`);

  // Extract Signature SHA-1
  let certSha1;
  try {
    certSha1 = extractApkCertificate(apkPath);
  } catch (err) {
    console.error(`::error::Failed to extract APK signature: ${err.message}`);
    process.exit(1);
  }

  console.log(`[INFO] Expected Certificate SHA-1 : ${EXPECTED_SHA1}`);
  console.log(`[INFO] Actual Certificate SHA-1   : ${certSha1}`);

  if (certSha1 !== EXPECTED_SHA1) {
    console.error('::error::CRITICAL SIGNING ERROR: APK was not signed with the permanent HyperTools release keystore!');
    console.error(`::error::Expected: ${EXPECTED_SHA1}`);
    console.error(`::error::Actual:   ${certSha1}`);
    process.exit(1);
  }

  console.log('=====================================================');
  console.log('[SUCCESS] APK is verified and signed with permanent key!');
  console.log('=====================================================');
}

main();
