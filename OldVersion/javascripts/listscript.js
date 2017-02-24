// Javascript for listings page// --------------------------------------------------------------------------
// GPL statement:
// This file is part of RDB.

// RDB is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// RDB is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with the RDB code.  If not, see <http://www.gnu.org/licenses/>.
// --------------------------------------------------------------------------

// Key plugins used:
// - sheetrock.js (Connect to Google Sheet, listing data loading)
// - list.js (Listings formatting and behaviors, pagination, filtering/searching)
// - selectize.js (Departments/Schools filter dropdown)
// - mark.js (Highlighting)

"use strict";

// Starting initial filters state
$(window).on('beforeunload', function() {
    // Clear filters/search
    $('#searchbox').val('');
    $("#categories")[0].selectize.clear();
});
$(window).on('load', function() {
    // Initialize filter/search state (empty)
    RDBList.search();
    RDBList.filter();
});

/ Initialize List (using list.js)// Pagination parameters (list.js plugin)
var paginationParams = {
    name: "listPages",
    paginationClass: "pagination",
    innerWindow: 2,
    outerWindow: 1
};

// Entries list parameters (list.js)
var options = {
    // valueNames: class names for the different values of each list item
    // page: how many items that should be visible at the same time. Default 200
    // item: ID of item template element
    valueNames: [
        'name',
        'departments',
        'email',
        'description',
        {name: 'website', attr: 'href'}, // Go to website link
        {name: 'web1', attr: 'href'}, // Name link
        {name: 'email2', attr: 'href'}, // Email link
        'desc_unwrapped' // Not used for html DOM but for searching
    ],
    page: 15,
    item: 'databaseitem', // Direct to the databaseitem element
    plugins: [ListPagination(paginationParams)] // For pages manipulation
};

// Make list (list.js)
var RDBList = new List('RDB', options);

// Events setup functions for various js work after entries have loaded; called after list.js call to add
// (Re)check pages state and adjust prev/next buttons; Update highlighting
function checkPrevNext() {
    // Take care of hiding prev or next buttons, depending on pages and current page
    if ($('.active').length === 0) {
        // Check empty
        $('#next').css('visibility', 'hidden');
        $('#prev').css('visibility', 'hidden');
    }
    else {
        // Check next
        if ($('.active').next().length === 0) {
            $('#next').css('visibility', 'hidden');
        }
        else {
            $('#next').css('visibility', 'visible');
        }
        // Check prev
        if ($('.active').prev().length === 0) {
            $('#prev').css('visibility', 'hidden');
        }
        else {
            $('#prev').css('visibility', 'visible');
        }
    }

    // Also, help take care of keeping highlights on the side
    highlightf();
}
// Pagination events, back to top, and reset filters, etc.
function postEntryWork() {
    // Checking page buttons and add events
    checkPrevNext();
    $('.pager ul').click(function() {
        checkPrevNext();
        $('html, body').scrollTop(200); // Go back to top whenever pages changed
    });
    $('#prev').click(function() {
        $('.active').prev().trigger('click'); // Transmit click event to the previous page number
        checkPrevNext();
    });
    $('#next').click(function() {
        $('.active').next().trigger('click'); // Transmit click event to the next page number
        checkPrevNext();
    });
    // Pages would change upon filters as well
    $('#searchbox').keyup(checkPrevNext);
    $('#categories').change(checkPrevNext);

    // Scroll to top button
    $('#back-top').hide();
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#back-top').fadeIn(300);
        }
        else {
            $('#back-top').fadeOut(300);
        }
    });
    $('#back-top').click(function() {
        $('body,html').animate({scrollTop:0}, 400);
    });

    // Reset filters
    $('#reset-button-id').click(function() {
        $('#searchbox').val('');
        $("#categories")[0].selectize.clear();
        RDBList.search();
        RDBList.filter();
        checkPrevNext();
    });
}

// Retrieve and load data from Google Spreadsheet (using sheetrock.js)
// Hide entries while load entries (sheetrock.js)
$("#rdblistings, .pager").hide();

// Update entries (sheetrock call)
var updateResults = function(error, options, response) {
    // Report error
    if(error) {console.log("Errors: ", error);}

    // Parse response from sheet, curate, and load
    var data = [];
    var id_num = 0;
    var deptTemp = "";
    for (var i = 1; i < response.rows.length; i++) {
        // Replicate url to also use as hyperlink address
        response.rows[i].cells.web1 = response.rows[i].cells.website;

        // Format description
        // Save an unwrapped copy for searching
        response.rows[i].cells.desc_unwrapped = response.rows[i].cells.description;
        // For hide/show control
        // Assign id_num to each description so each of the hide/show button can correspond to their text specifically
        id_num = Math.floor((Math.random() * 10000) + 1);
        response.rows[i].cells.description =
            "<input type='checkbox' class='hiddentrig' id='item" + id_num + "'><span class='desc-text'>" +
            response.rows[i].cells.description +
            "</span><label class='show-text' for='item" + id_num + "'>";

        // Replicate email to also use as mailto: link
        response.rows[i].cells.email2 = "mailto:" + response.rows[i].cells.email;

        // Format departments
        // Departments are formatted as "Dept, Dept, Dept,"
        // Processing to "<span>Dept</span><span>Dept</span><span>Dept</span>"
        deptTemp = "<span>" + response.rows[i].cells.departments.replace(/;\s*/g, "</span><span>"); // Commas to separate lines (span)
        response.rows[i].cells.departments = deptTemp.slice(0, deptTemp.length - 6); // Get rid of the extra "<span>" at the end

        // We're set!
        data.push(response.rows[i].cells);
    }
    // Load entries by relaying to list.js code
    RDBList.add(data);

    // Ready to present the entries!
    $("#loader").hide();
    $("#rdblistings, .pager").show();

    // Note: by this points the entries are all set
    // Take care of all events and js work etc.
    postEntryWork();
};

// Parameters for sheetrock
var params = {
    url: 'https://docs.google.com/spreadsheets/d/1hJSYPwbuKZiVFaqV2a1yIEkjrjbZ_Mz9XM4xSK0j-WQ/edit#gid=806509658', // See sheetrock documentation
    query: "select A,B,C,D,E",
    callback: updateResults,
    reset: true
};

// Sheetrock!
sheetrock(params);

// Remaining functionalities to setup
// Creating and formatting categories dropdown (selectize.js)
$('#categories').selectize({
    sortField: 'text'
});

// Highlight match terms (mark.js)
var hlinstance = null;
var hlcontext = null;
// var for saving searched keywords; for highlighting
var savedkeywords = [];
// Highlighting updating function
var highlightf = function() {
    if (hlinstance) {hlinstance.unmark();} // Remove existing highlights
    hlcontext = document.querySelectorAll(".name, .desc-text"); // Determines where to search-- name and description
    hlinstance = new Mark(hlcontext); // Setup instance
    hlinstance.mark(savedkeywords); // Gotcha! Default is case insensitive
};

// Filtering; based on search box and category selection (list.js)
var filterData = function() {
    // Get keyword search string
    var searchString = $('#searchbox').val().toLowerCase(); // Convert to lowercase
    var searchArray = searchString.split(" ").filter(Boolean); // Split by space and remove empty items (multiple spaces)
    var keywordLength = searchArray.length; // Save length for iteration

    // Get dept/school search filter
    var categorySelection = $('#categories').val();
    // Due to formatting, span tags are present; include to make sure only full match dept names are included i.e. American Studies but not African American Studies
    var modCategorySelection = "<span>" + categorySelection + "</span>";

    // Start filtering!
    // See List.js documentation: "RDBList.filter(function(item){...});" limits shown listings to only when the function returns true, depending on value of item
    // Both keyword and dept
    if (keywordLength && categorySelection) {
        RDBList.filter(function(item) {
            // Eliminate if dept not in list
            if (item.values().departments.indexOf(modCategorySelection) == -1){
                return false;
            }
            // The item also need to have all the keywords
            for (var i = 0; i < keywordLength; i++) {
                if (item.values().desc_unwrapped.toLowerCase().indexOf(searchArray[i]) == -1 &&
                    item.values().name.toLowerCase().indexOf(searchArray[i]) == -1) {
                        return false;
                }
            }
            // You passed the tests!
            return true;
        });
    }
    // Only dept
    else if (categorySelection) {
        RDBList.filter(function(item) {
            // Check department
            return (item.values().departments.indexOf(modCategorySelection) != -1);
        });
    }
    // Only keywords
    else if (keywordLength) {
        RDBList.filter(function(item) {
            // Must include all keywords. Searches only name and description
            for (var i = 0; i < keywordLength; i++) {
                if (item.values().desc_unwrapped.toLowerCase().indexOf(searchArray[i]) == -1 &&
                    item.values().name.toLowerCase().indexOf(searchArray[i]) == -1) {
                        return false;
                }
            }
            // You're good!
            return true;
        });
    }
    // None
    else {
        RDBList.filter(); // Remove all filters
    }

    // Highlight match terms
    savedkeywords = searchArray;
    highlightf();
};
// Events for triggering filters
$('#searchbox').keyup(filterData);
$('#categories').change(filterData);
