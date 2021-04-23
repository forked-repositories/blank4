const service = require('./service')

const WHITE_LIST = ['热搜', '微博热搜', 'RS', 'WBRS']

module.exports = options => {
  return async ({ data, ws, http }) => {
    if (!data.message) {
      return
    }

    const message = data.message.toUpperCase().trim()
    if (!WHITE_LIST.includes(message)) {
      return
    }

    if (data.message_type === 'group') {
      ws.send('send_group_msg', {
        group_id: data.group_id,
        message: [
          {
            type: 'reply',
            data: {
              id: data.message_id,
            },
          },
          ...(await service.getList()),
        ],
      })
      return
    }

    if (data.message_type === 'private') {
      ws.send('send_private_msg', {
        user_id: data.user_id,
        message: await service.getList(),
      })
      return
    }
  }
}
