
jQuery(App);
function App($) {

    const input = $("#input");
    const table = $("#dataTable");
    const searchButton = $("#searchButton");
    const whatPlace = $("#whatPlace");
    let resultsCount = 20;
    let tableIndex = 0;
    let userLanguage = navigator.language;

    checkUserBrowserLanguage();
    checkScreenAndLimitResultsIfNeeded();
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

    function checkScreenAndLimitResultsIfNeeded() {
        let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
        if (isMobile) {
            resultsCount = 10;
        }
    }

    function translateInGreek() {
        whatPlace.html("Ποιο μέρος θέλετε να αναζητήσετε;")
        input.attr("placeholder", "π.χ. Αθήνα");
        searchButton.text("Αναζήτηση");
    }
    //HTML handling end


    function handleInput() {
        handleInputLanguage();
        const inputLength = input.val().length;

        if (inputLength > 1) {
            clearTimeout(window.timer);
            window.timer = setTimeout(getLocations, 700);
        } else if (inputLength < 2) {
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

        if (sessionStorage.getItem(URL) === null) { // Make the call if url isn't cached
            const options = {
                url: URL,
                success: handleResponce,
                error: handleError
            };
            Smartjax.ajax(options);
        } else {
            getDataFromSessionStorage(URL);
        }
        window.timer = setTimeout(clearTimer, 300000); // Clear Session Storage cache after 5 minutes
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

    function checkUserBrowserLanguage() {
        userLanguage = userLanguage.toLowerCase().substring(0, 2);
        if (userLanguage == "el") {
            translateInGreek();
        } else {
            userLanguage = "en"; //Make it English
        }
    }

    function handleInputLanguage() {
        let code = input.val().substring(0, 1).charCodeAt(0);
        if (isGreek(code)) {
            userLanguage = "el";
        }
        else {
            userLanguage = "en";
        }
    }

    function isGreek(charCode) {
        return (charCode >= 902 && charCode <= 974)
    }

    function handleError(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    };

    //Search Button - Google
    function searchToGoogle() {
        window.open('http://www.google.com/search?q=' + input.val(), '_blank');
        input.val("").focus();
        table.empty();
        searchButton.prop('disabled', true);
    }
}
