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
        })
        .sort((a, b) => {
            if (a.showIndex === b.showIndex && a.showIndex === true) {
                return 0;
            }

            if (a.hongfs_id > config.index_generator.per_page) {
                return 0;
            }

            if (b.hongfs_id > config.index_generator.per_page) {
                return 0;
            }

            return a.showIndex === false ? 1 : -1;
        });

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
