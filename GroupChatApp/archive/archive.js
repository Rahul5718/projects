const cron = require('node-cron');
const { Op } = require('sequelize');
const Message = require('../model/message');      
const OldMessage = require('../model/oldMessage'); 
const sequelize = require('../util/Database');     

function initArchiveJob() {
   
    cron.schedule('0 0 * * *', async () => {
        console.log('🔄 Starting automated background chat archiving sequence...');
        
        const transaction = await sequelize.transaction();

        try {
            const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

            
            const messagesToArchive = await Message.findAll({
                where: {
                    createdAt: { [Op.lt]: cutoffTime }
                },
                raw: true,
                transaction
            });

            if (messagesToArchive.length > 0) {
                const recordsToInsert = messagesToArchive.map(({ id, ...rest }) => rest);

        
                await OldMessage.bulkCreate(recordsToInsert, { transaction });


                await Message.destroy({
                    where: {
                        createdAt: { [Op.lt]: cutoffTime }
                    },
                    transaction
                });

                await transaction.commit();
                console.log(`✅ Success! Compressed and moved ${messagesToArchive.length} chat lines to archival database storage.`);
            } else {
                await transaction.commit();
                console.log('ℹ️ Archiving skipped: Active message table is already optimal.');
            }

        } catch (archiveError) {
            await transaction.rollback();
            console.error('🚨 CRITICAL: Chat Archiving process aborted due to runtime error:', archiveError);
        }
    });
    
    console.log('⏰ Automated background Cron Job initialized successfully.');
}


module.exports = initArchiveJob;