function getMsgLaunch3rdPartyApp(appId) {
    return {
        method: 'ms.channel.emit',
        params: {
            data: {
                action_type: 'DEEP_LINK',
                appId: appId
            },
            event: 'ed.apps.launch',
            to: 'host'
        }
    };
}


module.exports = {
    getMsgLaunch3rdPartyApp
};