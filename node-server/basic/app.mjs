import owServer from 'openwanderer-server';
import express from 'express';

 
owServer.use(express.static('public'));

owServer.listen(3000);
