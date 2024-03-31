// import * as amqp from 'amqplib';

// export default new class RabbitMqConfig {
//     async sendToMessage(queueName: string, payload: any) : Promise<boolean> {
//         try {
//             const connection = await amqp.connect(process.env.URL_CONNECT)
//             const chanel = await connection.creatChanel()

//             await chanel.assertQueue(queueName)
            
//             chanel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)))

//             await chanel.close()
//             await connection.close()
//             return null
//         } catch (error) {
//             return error
//         }
//     }
// }