ol.service('dropboxService', function() {
    var client;
    var outlineData = [];
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
        mkdir: function(name) {
            if (!client || !client.isAuthenticated()) return;
            client.mkdir(name, function(error, stat) {
                // ignore errors, since directory could already exist
                if (error) return false;
                return true;
            });
        },
        getList: function() {
            var result = [];
            if (!client || !client.isAuthenticated()) return false;

            client.readdir("/json", function(error, entries, dir_stat, entry_stats) {
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
        getOutline: function(scope, name) {
            var result = [];
            if (!name) return;
            name = name.toLowerCase()
            // get outlines from json directory
            name = 'json/' + name;

            client.readFile(name, function(error, rawData) {
                if (error) {
                    outlineData = [];
                    // if we are connected to dropbox, send an event so it
                    // is known that the file couldn't be fetched
                    if (client && client.isAuthenticated()) {
                        scope.$emit('dropboxGotOutline');
                    }
                    return false;
                }
                outlineData = JSON.parse(rawData);
                scope.$emit('dropboxGotOutline');
            });
            return true;
        },
        getOutlineData: function() {
            return outlineData;
        },
        putOutline: function(name, data) {
            if (!name) return;
            name = name.toLowerCase();
            // store outlines in json directory
            name = 'json/' + name;
            var dropboxData = JSON.stringify(data);
            client.writeFile(name, dropboxData, function(error, stat) {
                if (error) {
                    console.log('[ERROR] writing file');
                    console.log(error);
                    return false;
                }
                return true;
            });
        }
    };
});
