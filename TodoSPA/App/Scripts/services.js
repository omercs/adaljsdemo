var phonecatServices = angular.module('phoneListSvc', []);

phonecatServices.factory('phoneListSvc', ['$http', 'adalAuthenticationService', function ($http, adalAuthenticationService) {
    return {

        getItems: function () {
            dataResults = [];

            // do some processing on json response 
            $http.get('/api/phoneList').success(function (data) {

                for (var i = 0; i < data.length; i++) {
                    dataResults.push(data[i]);
                }

            });
            return dataResults;

        },
        getItem: function (id) {
            return $http.get('/api/PhoneList/' + id);
        },
        postItem: function (item) {
            return $http.post('/api/PhoneList/', item);
        },
        putItem: function (item) {
            return $http.put('/api/PhoneList/', item);
        },
        deleteItem: function (id) {
            return $http({
                method: 'DELETE',
                url: '/api/PhoneList/' + id
            });
        }
    };
}]);

var jwtServices = angular.module('jwtHelperSvc', []);

jwtServices.factory('jwtHelperSvc', ['$http', '$q', function ($http, $q) {
    var apiUrl = "https://login.windows.net/";
    var jwsLib = null;

    var factory = function (instance, tenant, token, audience) {
        this.instance = instance;
        this.tenant = tenant;
        this.token = token;
        this.audience = audience;
        this.jwsLib = new KJUR.jws.JWS();
    };

    // TODO use adal base functions instead of copyin here
    var _logstatus = function (msg) {
        if (console) {
            console.log(msg);
        }
    };

    var _decodeJwt = function (jwtToken) {
        var idTokenPartsRegex = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/;

        var matches = idTokenPartsRegex.exec(jwtToken);
        if (!matches || matches.length < 4) {
            _logstatus('The returned id_token is not parseable.');
            return null;
        }

        var crackedToken = {
            header: matches[1],
            JWSPayload: matches[2],
            JWSSig: matches[3]
        };

        return crackedToken;
    };

    var _base64DecodeStringUrlSafe = function (base64IdToken) {
        // html5 should support atob function for decoding
        base64IdToken = base64IdToken.replace(/-/g, '+').replace(/_/g, '/');
        if (window.atob) {
            return decodeURIComponent(escape(window.atob(base64IdToken))); // jshint ignore:line
        }

        _logstatus('Browser is not supported');
        return null;
    };

    var _extractToken = function (encodedIdToken) {
        // id token will be decoded to get the username
        var decodedToken = _decodeJwt(encodedIdToken);
        if (!decodedToken) {
            return null;
        }

        try {
            var base64IdToken = decodedToken.JWSPayload;
            var base64Decoded = _base64DecodeStringUrlSafe(base64IdToken);
            if (!base64Decoded) {
                _logstatus('The returned id_token could not be base64 url safe decoded.');
                return null;
            }

            // ECMA script has JSON built-in support
            return JSON.parse(base64Decoded);
        } catch (err) {
            _logstatus('The returned id_token could not be decoded: ' + err.stack);
        }

        return null;
    };

    var _fixPEMFormat = function (cert) {
        // PEM format
        var beginCert = '-----BEGIN CERTIFICATE-----';
        var endCert = '-----END CERTIFICATE-----';

        cert = cert.replace('\n', '');
        cert = cert.replace(beginCert, '');
        cert = cert.replace(endCert, '');

        var result = beginCert;
        while (cert.length > 0) {

            if (cert.length > 64) {
                result += '\n' + cert.substring(0, 64);
                cert = cert.substring(64, cert.length);
            }
            else {
                result += '\n' + cert;
                cert = '';
            }
        }

        if (result[result.length] !== '\n') {
            result += '\n';
        }

        result += endCert + '\n';
        return result;
    };

    // Verify Azure Active directory token
    factory.prototype.verifyAADToken = function () {
        // get certs        var self = this;
        var def = $q.defer();
        var hostTarget = apiUrl;
        if (self.instance) {
            hostTarget = self.instance;
        }

        var parsedPayload = _extractToken(self.token);
        if (parsedPayload == null) {
            throw new Error('Token is not JWT');
        }

        if (self.audience.indexOf(parsedPayload.aud) < 0) {
            throw new Error('Token does not have valid audience');
        }

        var tid = self.tenant;

        if (!tid && !parsed.hasOwnProperty('tid')) {
            throw new Error('Token does not have tid claim');
        }

        if (!tid) {
            tid = parsedPayload.tid;
        }


        var t = '{"keys":[{"kty":"RSA","use":"sig","kid":"kriMPdmBvx68skT8-mPAB3BseeA","x5t":"kriMPdmBvx68skT8-mPAB3BseeA","n":"kSCWg6q9iYxvJE2NIhSyOiKvqoWCO2GFipgH0sTSAs5FalHQosk9ZNTztX0ywS/AHsBeQPqYygfYVJL6/EgzVuwRk5txr9e3n1uml94fLyq/AXbwo9yAduf4dCHTP8CWR1dnDR+Qnz/4PYlWVEuuHHONOw/blbfdMjhY+C/BYM2E3pRxbohBb3x//CfueV7ddz2LYiH3wjz0QS/7kjPiNCsXcNyKQEOTkbHFi3mu0u13SQwNddhcynd/GTgWN8A+6SN1r4hzpjFKFLbZnBt77ACSiYx+IHK4Mp+NaVEi5wQtSsjQtI++XsokxRDqYLwus1I1SihgbV/STTg5enufuw==","e":"AQAB","x5c":["MIIDPjCCAiqgAwIBAgIQsRiM0jheFZhKk49YD0SK1TAJBgUrDgMCHQUAMC0xKzApBgNVBAMTImFjY291bnRzLmFjY2Vzc2NvbnRyb2wud2luZG93cy5uZXQwHhcNMTQwMTAxMDcwMDAwWhcNMTYwMTAxMDcwMDAwWjAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkSCWg6q9iYxvJE2NIhSyOiKvqoWCO2GFipgH0sTSAs5FalHQosk9ZNTztX0ywS/AHsBeQPqYygfYVJL6/EgzVuwRk5txr9e3n1uml94fLyq/AXbwo9yAduf4dCHTP8CWR1dnDR+Qnz/4PYlWVEuuHHONOw/blbfdMjhY+C/BYM2E3pRxbohBb3x//CfueV7ddz2LYiH3wjz0QS/7kjPiNCsXcNyKQEOTkbHFi3mu0u13SQwNddhcynd/GTgWN8A+6SN1r4hzpjFKFLbZnBt77ACSiYx+IHK4Mp+NaVEi5wQtSsjQtI++XsokxRDqYLwus1I1SihgbV/STTg5enufuwIDAQABo2IwYDBeBgNVHQEEVzBVgBDLebM6bK3BjWGqIBrBNFeNoS8wLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldIIQsRiM0jheFZhKk49YD0SK1TAJBgUrDgMCHQUAA4IBAQCJ4JApryF77EKC4zF5bUaBLQHQ1PNtA1uMDbdNVGKCmSf8M65b8h0NwlIjGGGy/unK8P6jWFdm5IlZ0YPTOgzcRZguXDPj7ajyvlVEQ2K2ICvTYiRQqrOhEhZMSSZsTKXFVwNfW6ADDkN3bvVOVbtpty+nBY5UqnI7xbcoHLZ4wYD251uj5+lo13YLnsVrmQ16NCBYq2nQFNPuNJw6t3XUbwBHXpF46aLT1/eGf/7Xx6iy8yPJX4DyrpFTutDz882RWofGEO5t4Cw+zZg70dJ/hH/ODYRMorfXEW+8uKmXMKmX2wyxMKvfiPbTy5LmAU8Jvjs2tLg4rOBcXWLAIarZ"]},{"kty":"RSA","use":"sig","kid":"MnC_VZcATfM5pOYiJHMba9goEKY","x5t":"MnC_VZcATfM5pOYiJHMba9goEKY","n":"vIqz+4+ER/vNWLON9yv8hIYV737JQ6rCl6XfzOC628seYUPf0TaGk91CFxefhzh23V9Tkq+RtwN1Vs/z57hO82kkzL+cQHZX3bMJD+GEGOKXCEXURN7VMyZWMAuzQoW9vFb1k3cR1RW/EW/P+C8bb2dCGXhBYqPfHyimvz2WarXhntPSbM5XyS5v5yCw5T/Vuwqqsio3V8wooWGMpp61y12NhN8bNVDQAkDPNu2DT9DXB1g0CeFINp/KAS/qQ2Kq6TSvRHJqxRR68RezYtje9KAqwqx4jxlmVAQy0T3+T+IAbsk1wRtWDndhO6s1Os+dck5TzyZ/dNOhfXgelixLUQ==","e":"AQAB","x5c":["MIIC4jCCAcqgAwIBAgIQQNXrmzhLN4VGlUXDYCRT3zANBgkqhkiG9w0BAQsFADAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MB4XDTE0MTAyODAwMDAwMFoXDTE2MTAyNzAwMDAwMFowLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALyKs/uPhEf7zVizjfcr/ISGFe9+yUOqwpel38zgutvLHmFD39E2hpPdQhcXn4c4dt1fU5KvkbcDdVbP8+e4TvNpJMy/nEB2V92zCQ/hhBjilwhF1ETe1TMmVjALs0KFvbxW9ZN3EdUVvxFvz/gvG29nQhl4QWKj3x8opr89lmq14Z7T0mzOV8kub+cgsOU/1bsKqrIqN1fMKKFhjKaetctdjYTfGzVQ0AJAzzbtg0/Q1wdYNAnhSDafygEv6kNiquk0r0RyasUUevEXs2LY3vSgKsKseI8ZZlQEMtE9/k/iAG7JNcEbVg53YTurNTrPnXJOU88mf3TToX14HpYsS1ECAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAfolx45w0i8CdAUjjeAaYdhG9+NDHxop0UvNOqlGqYJexqPLuvX8iyUaYxNGzZxFgGI3GpKfmQP2JQWQ1E5JtY/n8iNLOKRMwqkuxSCKJxZJq4Sl/m/Yv7TS1P5LNgAj8QLCypxsWrTAmq2HSpkeSk4JBtsYxX6uhbGM/K1sEktKybVTHu22/7TmRqWTmOUy9wQvMjJb2IXdMGLG3hVntN/WWcs5w8vbt1i8Kk6o19W2MjZ95JaECKjBDYRlhG1KmSBtrsKsCBQoBzwH/rXfksTO9JoUYLXiW0IppB7DhNH4PJ5hZI91R8rR0H3/bKkLSuDaKLWSqMhozdhXsIIKvJQ=="]}]}';
        var testKeys = JSON.parse(t);
        var testResult = _checkSignature(self, testKeys);
        console.log('TEST:' + testResult);
        return testResult;

        //// Get Certs to verify signature
        //// it does not work since CORS api not allowed for metadata
        //$http.defaults.useXDomain = true;
        //delete $http.defaults.headers.common['X-Requested-With'];
        //$http.get(hostTarget + tid + '/.well-known/openid-configuration')
        //    .then(function (result) {
        //        //post-process results and return
        //        var configResult = JSON.parse(data);
        //        _logstatus('Config:' + configResult);

        //        return configResult;
        //    }).then(function (jwksResult) {
        //        return $http.get(jwksResult.jwksUri).success(function (data) {
        //            var resultKeys = JSON.parse(data);
        //            var validSignature = false;
        //            // Check issuer
        //            if (jwksResult.issuer === parsedPayload.iss) {
        //                validSignature = _checkSignature(self, jwksResult.keys)
        //            }

        //            def.resolve(validSignature);
        //        }).error(function () {
        //            def.reject("Failed to get openid config");
        //        });
        //    })

        //return def.promise;
    };

    var _checkSignature = function (selfref, discoveryKeys) {
        var validSignature = false;

        // Use x5c to check signature
        // jwk has also n and e that can be used to verify.
        discoveryKeys.keys.forEach(function (key) {
            key.x5c.forEach(function (x5c) {

                if (!validSignature) {
                    // Check issuer
                    var certData = x5c;

                    // Convert cert
                    var pemCert = _fixPEMFormat(certData);
                    console.log('PEM:' + pemCert);
                    try {
                        validSignature = selfref.jwsLib.verifyJWSByPemX509Cert(selfref.token, pemCert);
                    } catch (ex) {
                        alert('Error: ' + ex);
                        console.log('Error:' + ex);
                        result = 0;
                    }
                }
            });
        });

        return validSignature;
    }

    factory.prototype.claims = function () {
        var parsedPayload = _extractToken(self.token);
        if (parsedPayload == null) {
            throw new Error('Token is not JWT');
        }

        return parsedPayload;
    };

    return factory;
}]);