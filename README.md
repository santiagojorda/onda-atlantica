## ONDA ATLANTICA

run server 
```
DEBUG=myappyapp:* npm start
```

clean server port
```
fuser -k 3000/tcp

--
fuser -k 3000/tcp & DEBUG=myappyapp:* npm start

```


