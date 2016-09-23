# _.template() Manager 

Helps you manage template using lodash and jquery.

Needs AJAX (cannot work on the file:// protocol)

# Install

    npm install lodash-template-manager

# Example

    <html>
        <head>
            <script src="./js/jquery.min.js" type="text/javascript">
            </script> 
            <script src="./js/lodash.min.js" type="text/javascript">
            </script>
            <script src="./node_modules/lodash-template-manager/dist/templateManager.min.js" type="text/javascript">
            </script>
            <script type="text/javascript">
                var viewPaths = {
                  firstTemplate: "./templates/firstTemplate.html",
                  secondTemplate: "./templates/secondTemplate.html"
                }; 
                
                var templateManager = new TemplateManager(viewPaths, function () {
                    // this is the callback
                    var variables = {variableOne: 1, variableTwo: "two"};
                    window.templateManager.renderInTarget("firstTemplate", variables, ".container");
                    
                    var rawHTML = window.templateManager.render("secondTemplate", variables);
        
                    console.log(rawHTML);
                });
            </script>
        </head>
        <body>
            <div class="container">
            </div>
        </body>
    </html>



# Docs 
https://albertbuchard.github.io/lodash-template-manager

# Important note
The is based on the code of someone (i think on stackOverflow) that I copied and reworked months ago. But I could not find the question or the name of the guy to give him credit. 
So if you happen to be that guy, please contact me so I could rightfully give you the credit you deserve.

MIT