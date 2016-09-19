var React = require('react');

var Layout = React.createClass({
    propTypes: {
        settings: React.PropTypes.object
    },
    render()
    {
        return (
            <html>
                <head lang="en">
                    <title>Revolut - FX Form</title>
                    <meta charSet="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
                    {/*<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css' />*/}
                    <link rel='stylesheet' href='/css/styles.css' />
                    <script type="text/javascript" dangerouslySetInnerHTML={{__html: 'window.revolutAPP='+JSON.stringify(this.props.settings)}} />
                </head>
                <body>
                    <main role="application" />
                    <script type="text/javascript" src='/js/main.js' />
                </body>
            </html>
        );
    }
});

module.exports = Layout;
