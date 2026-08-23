try { require('./server'); console.log('Server loads OK'); } catch(e) { console.error('ERROR:', e.message); }
setTimeout(() => process.exit(0), 3000);
