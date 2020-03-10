
jQuery(App);
function App($) {

    const input = $("#input");
    const table = $("#dataTable");
    const searchButton = $("#searchButton");
    let resultsCount = 20;
    let tableIndex = 0;
    let userLanguage = navigator.language || navigator.userLanguage;

    userLanguage = userLanguage.substring(0, 2);
    if (userLanguage.toLowerCase() != "el") { //If it isn't greek make it english to support other languages
        userLanguage = "en"
    }

    $(document).ready(limitResultsIfNeeded); //Set up results count
    input.focus();
    input.on("input", handleInput);
    searchButton.on("click", searchToGoogle);

    //HTML handling begin
    const addRowToTable = function (index, value) {
        tableIndex = index + 1;
        const newRowContent = "<tr><td class='selectedPlace'>" + value.name + "</td></tr>";
        table.append(newRowContent)
    };

    function changeInputToSelectedPlace() {
        input.val($(this).html());
        if (tableIndex > 0) {
            searchButton.prop('disabled', false);
        }
    }

    function limitResultsIfNeeded() {
        let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
        if (isMobile) {
            resultsCount = 10;
        }
    }
    //HTML handling end

    function handleInput() {
        const inputLength = input.val().length;

        if (inputLength > 1) {
            clearTimeout(window.timer);
            window.timer = setTimeout(getLocations, 700);
        } else if (inputLength < 2) { // Handling when user is deleting and reaching input length 1 and below
            clearTimeout(window.timer);
            table.empty();
            searchButton.prop('disabled', true);
        }
    }
    
    function getLocations() {

        let URL = "http://35.180.182.8/search";
        const searchText = "?keywords=" + input.val();
        const language = "&language=" + userLanguage;
        const limit = "&limit=" + resultsCount;
        URL = URL + searchText + language + limit;

        if (sessionStorage.getItem(URL) === null) { // make the call if searchText isn't cached
            const options = { url: URL, success: handleResponce };
            Smartjax.ajax(options);
        } else {
            getDataFromSessionStorage(URL);
        }  
        
        window.timer = setTimeout(clearTimer, 300000); // clear Session Storage cache after 5 minutes
    }

    function handleResponce(data) {
        table.empty();
        $(data.entries).each(addRowToTable);
        $(".selectedPlace").on("click", changeInputToSelectedPlace);
    };

    function getDataFromSessionStorage(URL) {
        const dataFromSessionStorage = JSON.parse(sessionStorage.getItem(URL));
        table.empty();
        $(dataFromSessionStorage.entries).each(addRowToTable);
        $(".selectedPlace").on("click", changeInputToSelectedPlace);
    }

    function clearTimer() {
        sessionStorage.clear();
    }

    //search Button - Google
    function searchToGoogle() {
        window.open('http://www.google.com/search?q=' + input.val(), '_blank');
        input.val("").focus();
        table.empty();
        searchButton.prop('disabled', true);
    }
}
