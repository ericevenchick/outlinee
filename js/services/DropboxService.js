outlinear.factory('dropboxService', function() {
    var client
    return {
        connect: function() {
            client = new Dropbox.Client({
                key: "qHAKiRxtIqA=|OdZ7A5Wo3uPEA8Zittjh+nxnpEY5UwntwPNp5ORNOA==",
                sandbox: true});

            client.authDriver(new Dropbox.Drivers.Redirect());
            client.authenticate(function(error, client) {
              if (error) {
                console.log("Error connecting to Dropbox!");
                console.log(error);
                return false;
              }
              return client;
            });

         }
    };
});
