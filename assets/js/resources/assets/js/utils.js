export {
    listenToAnchorLinkClicks,
    animateScrollTop
};

const $root = $('html, body'),
      animationDuration = 500;

/**
 * Listen to click events on anchor links
 */
function listenToAnchorLinkClicks () {
    $('a[href*="#"]').on('click', handleAnchorLinkClicks); 
}

/**
 * Handling anchor link clicks
 */
function handleAnchorLinkClicks () {

    const $this = $(this),
          $target = $( $this.attr('href') ),
          targetOffset = $target.offset();

    if (window.location.pathname !== '/') {
        window.location.href = window.location.origin + '/' + $this.attr('href');
    }

    if(!targetOffset) return;
    animateScrollTop(targetOffset.top);

    // If anchor link leads to product, it should open
    // panel below, buy triggering click event on it
    if($this.attr('data-target') === 'product') {
        setTimeout(() => {
            $target.find('a.logoBtn').not('.openedPanel').trigger('click');
        }, animationDuration);
    }
        
    return false;
}

//--------------------------------------------------------------------------------------------------
// Helper functions
//--------------------------------------------------------------------------------------------------

function animateScrollTop (offset) {
    $root.animate({scrollTop: offset}, animationDuration);
}
