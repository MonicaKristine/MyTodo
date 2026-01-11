const { Status } = require('../models');

async function insertStatus() {
    const statuses = [
        'Not Started',
        'Started',
        'Completed',
        'Deleted'
    ];

    for (const name of statuses) {
        const [status, created] = await Status.findOrCreate({
            where: { status: name}
        });

        if(created) {
            console.log('Populated Status table with ' + status.status);
        }
    }
}

module.exports = insertStatus;