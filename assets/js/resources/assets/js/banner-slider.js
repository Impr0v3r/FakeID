import Promise from 'promise-polyfill';

export default class BannerSlider {

    constructor () {  
        this.sliderInterval = null;
        this.intervalDuration = 5000;
        this.slideDirection = 'next'; // 'prev', 'next'
    }

    run () {
        if(!this.cacheDOM()) return; // nothing to slide
        this.numberOfBanners = this.$banners.length;
        this.renderPagination();
        this.attachEventListeners();
        this.autoSlideStart();
    }

    //--------------------------------------------------------------------------------------------------
    // Helper functions
    //--------------------------------------------------------------------------------------------------
     

    // DOM Caching
    
    cacheDOM () {
        this.$bannersContainer = $('#banners-container');
        this.$banners = this.$bannersContainer.find('.banner-row');
        this.$paginationContainer = $('#carousel-pagination');
        this.$bannerSectionContainer = $('.banner-wrapper');
        this.$hoverContainer = this.$bannerSectionContainer.find('.container');
        return this.isDOMCached();
    }

    isDOMCached () {
        if(this.$bannersContainer
            && this.$banners && this.$banners.length > 1
            && this.$paginationContainer
            && this.$bannerSectionContainer
        ) { 
            return true;
        } else {
            return false;
        }
    }

    // Events

    attachEventListeners () {
        this.paginationClickEvents();
        this.mobileSwipeEvents();
        this.tabChangeEvents();
        this.bannerHoverEvents();
    }

    // Event Handlers

    tabChangeEvents () {

        window.onfocus = () => {
            this.autoSlideStart();
        };

        window.onblur = () => {
            this.autoSlideStop();
        };
    }

    paginationClickEvents () {
        const self = this;
        self.$paginationContainer.on('click', 'ul li', function (e) {
            const indexOfClicked = $(this).index();
            self.handleAutoSlideInterrupt(self.jumpToBanner, self, indexOfClicked);
        });
    }

    mobileSwipeEvents () {
        // Attach swipe event listeners only for mobile devices
        if(!this.isMobile()) return;

        this.$bannerSectionContainer.on('swipeleft', (e) => {
            this.handleAutoSlideInterrupt(this.changeBanner, this, 'next');
        });

        this.$bannerSectionContainer.on('swiperight', (e) => {
            this.handleAutoSlideInterrupt(this.changeBanner, this, 'prev');
        });
    }

    bannerHoverEvents () {
        this.$hoverContainer.on('mouseenter', this.autoSlideStop.bind(this));
        this.$hoverContainer.on('mouseleave', this.autoSlideStart.bind(this));
    }

    // Handle Autoslide interrupt

    /**
     * Common function for pausing autoslide
     * when slider is interrupted, and resuming
     * when interrupt is handled
     * 
     * @param  {Function}        callback (must return promise)
     * @param  {jQuery object}   caller
     * @param  {*}               arg
     */
    handleAutoSlideInterrupt (callback, caller, arg) {
        this.autoSlideStop();

        callback.call(caller, arg).then(() => {
            this.autoSlideStart();
        });
    }

    // Autoslide
            
    autoSlideStart () {
        this.autoSlideStop();
        this.sliderInterval = setInterval(() => {
            this.changeBanner(this.slideDirection);
        }, this.intervalDuration);
    } 

    autoSlideStop () {
        clearInterval(this.sliderInterval);
        this.sliderInterval = null;
    }

    // Pagination

    renderPagination () {
        let $ul = $('<ul></ul>');
        for (let i = 0, n = this.numberOfBanners; i < n; i++) {
            if($(this.$banners[i]).hasClass('banner-row-visible')) {
                $ul.append('<li class="active-banner"></li>');
            } else {
                $ul.append('<li></li>');
            }
        };
        this.$paginationContainer.append($ul);
    }

    /**
     * Pagination from current index to target index
     * @param  {'next', 'prev'}   direction
     * @param  {integer}          currentIndex
     * @param  {integer}          toIndex
     */
    paginate (direction, currentIndex, toIndex) {
        let paginateTo = null;

        if(typeof toIndex === 'undefined' || toIndex === null) {
            paginateTo = (direction === 'prev') 
                ? this.getPrevBannerIndex(currentIndex)
                : this.getNextBannerIndex(currentIndex);
        } else {
            paginateTo = toIndex;
        }

        $(this.$paginationContainer.find('li')).removeClass('active-banner');
        $(this.$paginationContainer.find('li')[paginateTo]).addClass('active-banner');
    }

    // Navigation

    /**
     * Change banner
     * @param  {'next', 'prev'} direction
     * @return {Promise}
     */
    changeBanner (direction) {
        return this.getCurrentBannerData()
                .then(
                    (result) => {;
                        this.hideVisibleBanners();
                        this.goToBanner(direction, result.index);
                        this.paginate(direction, result.index);
                    },
                    (error) => {
                        console.error(error.message);
                    }
                );
    }

    /**
     * Jump to banner clicked within pagination
     * @param  {integer} clickedIndex
     */
    jumpToBanner (clickedIndex) {
        return this.getCurrentBannerData()
                .then(
                    (result) => {
                        if (result.index === clickedIndex) return;
                        this.hideVisibleBanners();
                        this.goToBanner('next', clickedIndex-1); 
                        this.paginate('next', result.index, clickedIndex);
                    },
                    (error) => {
                        console.error(error.message);
                    }
                );
    }

    /**
     * Go to banner
     * @param  {'next', 'prev'} direction
     * @param  {integer}        currentIndex
     */
    goToBanner (direction, currentIndex) {
        const toIndex = (direction === 'prev') 
                ? this.getPrevBannerIndex(currentIndex)
                : this.getNextBannerIndex(currentIndex);

        $(this.$banners[toIndex]).removeClass('banner-row-hidden');
        // Delay in order to fade in
        setTimeout(() => $(this.$banners[toIndex]).addClass('banner-row-visible'), 100);
    }

    // Index logic

    /**
     * Next banner index
     * @param  {integer} currentIndex
     * @return {integer}
     */
    getNextBannerIndex (currentIndex) {
        return (++currentIndex >= this.numberOfBanners) ? 0 : currentIndex;
    }

    /**
     * Prev banner index
     * @param  {integer} currentIndex
     * @return {integer}
     */
    getPrevBannerIndex (currentIndex) {
        return (--currentIndex < 0) ? (this.numberOfBanners - 1) : currentIndex;
    }

    /**
     * Keeping track of current banner
     * @return {Promise}
     */
    getCurrentBannerData () {

        let promise = new Promise((resolve, reject) => {

            // Match delay from goToBanner()
            setTimeout(() => {

                let $banner = $('.banner-row-visible');
                let index = $banner.index();

                if($banner) 
                    resolve({ $banner: $banner, index: index });
                else
                    reject({ message: 'Current banner not found.' });

            }, 100);
   
        });

        return promise;
    }

    /**
     * Check for mobile device
     * @return {Boolean}
     */
    isMobile () {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    // Banner manipulation

    hideVisibleBanners () {
        this.$banners.removeClass('banner-row-visible');
        this.$banners.addClass('banner-row-hidden');
    }    
}
