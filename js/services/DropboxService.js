outlinear.service('dropboxService', function() {
    var client;
    return {
        connect: function(scope) {
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
                    scope.$emit('dropboxConnected');
                    return true;
                });
        },
        auth: function(scope) {
            if (client && client.isAuthenticated()) return;

            client.authenticate(function(error, authClient) {
                if (error) {
                    console.log('[ERROR] connecting to Dropbox');
                    console.log(error);
                    return false;
                }
                client = authClient;
                scope.$emit('dropboxConnected');
                return true;
            });

        },
        isAuthenticated: function() {
            return client && client.isAuthenticated();
        },
        getList: function() {
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
        },
        getOutline: function(name) {
            client.readFile(name, function(error, data) {
                if (error) {
                    console.log('[ERROR] getting file');
                    console.log(error);
                    return false;
                }
                console.log(data);
                return [{str:'from dropbox',ind:0}];
            });
        }
    };
});
