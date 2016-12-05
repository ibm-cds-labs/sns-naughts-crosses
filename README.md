# sns-naughts-crosses
A Multiplayer Naughts and Crosses game built with the Simple Notification Service

## Configuration
You will need a running instance of the [Simple Notification Service](https://github.com/ibm-cds-labs/simple-notification-service).

In both the `/public/index.html` and `/public/game.html` files you will need to properly configure the SNS.

The current configuration points to a local installation:

````html
<script src="http://localhost:6011/client.js"></script>
````

this needs to be changed to something more like:

````html
<script src="http://my.sns.com/client.js"></script>
````

Where `http://my.sns.com` is a reference to your instance of the [Simple Notification Service](https://github.com/ibm-cds-labs/simple-notification-service).