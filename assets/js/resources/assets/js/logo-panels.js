import {animateScrollTop} from './utils';

export default class LogoPanel {

    constructor () {
        this.cacheDom();
    }

    run () {
        this.openPanel();
        this.closePanel();
    }

    // DOM caching
    cacheDom(){
        this.$body = $('body');

        this.$logoBtns = $('.logoBtn');
        this.$allPanels = $('.dropDownPanel');
        this.$logos = $('.logo-inside');
        this.$iconBars = $('.fa-bars');
        this.$videojs = $('.video-js');
        this.$ppNav = $('#pp-nav');
        this.isPanelOpened = false;
    }

    // Opening panels
    openPanel(){
        let self = this;
        this.$logoBtns.on('click', function(e){

            let $this = $(this),
                logo = $this.closest('.logo-inside'),
                iconBar = $this.find('.fa-bars'),
                iconTime = $this.find('.fa-times'),
                logoWrapper = $this.closest('.logoWrapper'),
                panel = logoWrapper.next('.dropDownPanel'),
                rowPosition = logoWrapper.position().top + logo.height();

            e.stopPropagation();
            e.preventDefault();
            self.isPanelOpened = $this.hasClass('openedPanel');

            // Toggle panel on click
            if(self.isPanelOpened){
                $this.removeClass('openedPanel');
                logo.removeClass('activeLogo');
                iconTime.removeClass('fa-times').addClass('fa-bars');
                panel.removeClass('visible');
                setTimeout(panel.css.bind(panel,'display','none'), 300);
            } else{
                animateScrollTop($this.offset().top - self.$ppNav.outerHeight() - 10);
                self.$allPanels.removeClass('visible').css('display', 'none');
                self.$logoBtns.removeClass('openedPanel');
                self.$logos.removeClass('activeLogo');
                self.$iconBars.removeClass('fa-times').addClass('fa-bars');
                $this.addClass('openedPanel');
                logo.addClass('activeLogo');
                iconBar.removeClass('fa-bars').addClass('fa-times');
                panel.css({top: rowPosition}).css('display', 'block').addClass('visible');
            }
            self.pauseVideos();
        });
    }

    closePanel(){
        let self = this;

            this.$allPanels.on('click', function(e){
                e.stopPropagation();
            });
            this.$body.on('click', function(e){
                if(!self.isPanelOpened){
                    self.$allPanels.removeClass('visible').css('display', 'none');
                    self.$logoBtns.removeClass('openedPanel');
                    self.$logos.removeClass('activeLogo');
                    self.$iconBars.removeClass('fa-times').addClass('fa-bars');
                    self.isPanelOpened = false;
                    self.pauseVideos();
                }
            });
    }

    pauseVideos(){
        this.$videojs.each(function(){
            this.pause();
        });
    }
}
