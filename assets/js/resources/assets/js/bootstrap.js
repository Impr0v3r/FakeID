import $ from 'jquery';
import BannerSlider from './banner-slider';
import LogoPanel from './logo-panels';
import FAQdropdown from './faq-dropdown';
import {listenToAnchorLinkClicks} from './utils';
import OnInit from './on-init';

//--------------------------------------------------------------------------------------------------
// App start
//--------------------------------------------------------------------------------------------------
        
init();

//--------------------------------------------------------------------------------------------------
// Bootstrap
//--------------------------------------------------------------------------------------------------

/**
 * Initialize app
 */
function init () {

    let bSlider = new BannerSlider(),
        lPanel = new LogoPanel(),
        faqDropdown = new FAQdropdown(),
        initJs = new OnInit();

    bSlider.run();
    lPanel.run();
    faqDropdown.run();
    initJs.run();

    // Utilities
    listenToAnchorLinkClicks();
}
