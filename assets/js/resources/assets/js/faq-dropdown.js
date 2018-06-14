export default class FAQdropdown {

    constructor () {  
        this.answersHeights = [];
    }

    run () {
        this.cacheDOM();
        this.attachEventListeners();
    }

    //--------------------------------------------------------------------------------------------------
    // Helper functions
    //--------------------------------------------------------------------------------------------------
     

    // DOM Caching
    
    cacheDOM () {
        this.$faqList = $('#section-faq ul');
        this.$faqQuestions = this.$faqList.find('li.faq-question');
        this.$faqAnswers = this.$faqList.find('li.faq-answer');
    }

    // Events

    attachEventListeners () {
        this.faqListClickEvent();
    }

    faqListClickEvent () {
        this.$faqList.on('click', 'li.faq-question', (event) => {
            this.toggleAnswers(event);
        });

        this.$faqList.on('click', 'li.faq-question span', (event) => {
            this.toggleAnswers(event)
        });
    }

    toggleAnswers(event) {
        const $clickedLi = $(event.currentTarget);
        const $answer = $clickedLi.next('.faq-answer');

        this.toggleSign($clickedLi);
        $answer.slideToggle(300);
    }

    toggleSign ($target) {
        const $span = $target.find('span');
        let sign = ($span.text() === '+') ? '-' : '+';
        $span.text(sign);
    }
}
