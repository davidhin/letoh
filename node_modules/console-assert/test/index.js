require('../').browserify();

try {
    console.assert(false, 'All is fine.');
} catch(e) {
    // Should not reach
    console.error('Assertion throwed');
    process.exit(1);
}
