$(document).ready(function () {
    // off canvas for small devices
    $(function () {
        'use strict';

        $('[data-toggle="offcanvas"]').on('click', function () {
            $('.offcanvas-collapse').toggleClass('open');
        });
    });
    
});