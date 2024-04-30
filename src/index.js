const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');
const fs = require('fs');

async function executeSELECTQuery(query) {
    try {
        const { fields, table, whereClause } = parseQuery(query);
        const filename = `${table}.csv`;

        if (!fs.existsSync(filename)) {
            throw new Error('File not found');
        }

        const data = await readCSV(filename);

        // Filtering based on WHERE clause
        const filteredData = whereClause
            ? data.filter(row => {
                const [field, value] = whereClause.split('=').map(s => s.trim());
                return row[field] === value;
            })
            : data;

        // Selecting the specified fields
        return filteredData.map(row => {
            const selectedRow = {};
            fields.forEach(field => {
                selectedRow[field] = row[field];
            });
            return selectedRow;
        });
    } catch (error) {
        console.error('Error:', error.message);
        // Handle or log the error accordingly
    }
}

module.exports = executeSELECTQuery;
