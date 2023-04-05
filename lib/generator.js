'use strict';

const pagination = require('hexo-pagination');

module.exports = function (locals) {
    const config = this.config;

    let posts = locals.posts.sort(config.index_generator.order_by);

    posts.data = posts.data
        .map((item, index) => {
            if (item.showIndex !== false) {
                item.showIndex = true;
            }

            item.hongfs_id = index;
            return item;
        });

    let tmp_posts = [];

    posts.data = posts.data.filter(v => {
        if(!v.showIndex) {
            tmp_posts.unshift(v);
        }

        return v.showIndex;
    });

    if(tmp_posts.length) {
        for(let i in tmp_posts) {
            let _post = tmp_posts[i];

            let index = posts.data.findIndex((v, index) => {
                if(index < config.index_generator.per_page) {
                    return false;
                }

                return _post.date.isAfter(v.date);
            });

            posts.data.splice(index, 0, _post);
        }
    }

    const paginationDir = config.pagination_dir || 'page';
    const path = config.index_generator.path || '';

    return pagination(path, posts, {
        perPage: config.index_generator.per_page,
        layout: ['index', 'archive'],
        format: paginationDir + '/%d/',
        data: {
            __index: true
        }
    });
};
