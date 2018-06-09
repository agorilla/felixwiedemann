// Vue base
import Vue from 'vue';
import App from './app.vue';

// Vue components

// Patterns
import TeaserClip from './patterns/p-teaser/p-teaser-clip.vue';
Vue.component('p-teaser-clip', TeaserClip);

import Navigation from './patterns/p-navigation/p-navigation.vue';
Vue.component('p-navigation', Navigation);

// Modules
import Intro from './modules/m-intro/m-intro.vue';
Vue.component('m-intro', Intro);

import Clips from './modules/m-clips/m-clips.vue';
Vue.component('m-clips', Clips);

import Txt from './modules/m-txt/m-txt.vue';
Vue.component('m-txt', Txt);

// Header
import Header from './modules/m-header/m-header.vue';

// Player
import Player from './modules/m-player/m-player.vue';

// Global data
import TitleData from '../content/title.json';
import NavigationData from '../content/navigation.json';

// Global services
const Services = require('./generic/services');

// Polyfills
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

// Vue Router
import VueRouter from 'vue-router';

const appRoutes = Services.getAppRoutes();

const routes = appRoutes.map(function (route, index) {
    const isIndex = route === '/';
    const hasPlayer = isIndex ? false : NavigationData[index - 1].player;
    const Component = require(`./pages${isIndex ? '/index' : route}.vue`);
    const title = `${TitleData.name} | ${TitleData.title}${ isIndex ? '' : ` : ${NavigationData[index - 1].title}`}`;

    return {
        path: route,

        components: {
            header: Header,
            main: Component.default,
        },

        children: hasPlayer ? [
            {
                path: ':clip',
                components: {
                    player: Player,
                },
                meta: {
                    title: title,
                },
            }
        ] : [],

        meta: {
            title: title,
        },
    }
});

routes.push({
    path: '*',
    redirect: '/',
});

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});

Vue.use(VueRouter);

// Vue initialization
new Vue({
    el: '#app',
    router,
    data: {
        title: TitleData,
        navigation: NavigationData,
        breakpoints: Services.getBreakpoints(),
        theme: 't-dark',
        bgImg: '',
        isIndex: true,
    },
    watch: {
        $route (to, from){
            // Detect if on index page
            this.isIndex = Services.detectIndex(this.$route);
        }
    },
    methods: {
        seoUrl: Services.seoUrl,
        getPageConfigByRoute: Services.getPageConfigByRoute,
    },
    created() {
        this.isIndex = Services.detectIndex(this.$route);
    },

    render: h => h(App),
});
