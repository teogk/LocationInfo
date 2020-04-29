# LocationInfo

## Description:
 A Front End App that:

- calls a location service and displays the results it returns
 (If a user selects one of those results it directs them to Google and searches for that place)

- passes the language of the browser and user input in order to retrieve translated results

- introduces a blank period timeout during which no calls to the location service will be performed while the user keystrokes happen faster than that timeout to prevent wasteful of the server resources
  
- caches the results of the location service (Smartjax Plugin)

- be responsive and cater for views from tablets and mobiles
