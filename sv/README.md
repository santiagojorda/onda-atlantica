## Onda Atlantica (Server)

Run local server from onda-atlantica/sv/
```
DEBUG=myappyapp:* npm start
```

Clean local server port
```
fuser -k 3000/tcp

--
fuser -k 3000/tcp & DEBUG=myappyapp:* npm start

```


