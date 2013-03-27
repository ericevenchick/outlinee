outlinear.service('dropboxService', function() {
    var client;
    return {
        connect: function() {
            client = new Dropbox.Client({
                key: 'qHAKiRxtIqA=|OdZ7A5Wo3uPEA8Zittjh+nxnpEY5UwntwPNp5ORNOA==',
                   sandbox: true});
            client.authDriver(new Dropbox.Drivers.Redirect(
                    {rememberUser: true}));
            client.authenticate({interactive: false},
                function(error, authClient) {
                    if (error) {
                        console.log('[ERROR] connecting to Dropbox');
                        console.log(error);
                        return false;
                    }
                    client = authClient;
                    return true;
                });
        },
        auth: function() {
            if (client && client.isAuthenticated()) return;

            client.authenticate(function(error, authClient) {
                if (error) {
                    console.log('[ERROR] connecting to Dropbox');
                    console.log(error);
                    return false;
                }
                client = authClient;
                return true;
            });

        },
        isAuthenticated: function() {
            return client && client.isAuthenticated();
        },
        getOutlines: function() {
            var result = [];
            if (!client || !client.isAuthenticated()) return false;

            client.readdir("/", function(error, entries, dir_stat, entry_stats) {
                if (error) {
                    console.log('[ERROR] getting entry list from Dropbox');
                    console.log(error);
                    return false;
                }
                // copy entries into result array
                // TODO: could this be simpler?
                for (var i=0; i < entries.length; i++) {
                    result.push(entries[i]);
                }
            });
            return result;
        }
    };
});
