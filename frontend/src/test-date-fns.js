// Simple test file to verify that date-fns is working correctly
const { format } = require('date-fns');

console.log('Testing date-fns:');
console.log(format(new Date(), 'yyyy-MM-dd')); 