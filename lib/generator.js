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

    if (posts.data.length > config.index_generator.per_page) {
        while (true) {
            let has = false;

            for (let i = config.index_generator.per_page - 1; i >= 0; i--) {
                let post = posts.data[i];

                if (post.showIndex === true) {
                    continue;
                }

                let result = posts.data.splice(i, 1);

                let index = posts.data.findIndex(item => {
                    if (config.index_generator.per_page >= item.hongfs_id) {
                        return false;
                    }

                    console.log(item.date, post.date);

                    if (post.date.isAfter(item.date)) {
                        return true;
                    }

                    return false;
                });

                posts.data.splice(index + 1, 0, ...result);
                has = true;

                break
            }

            if (has === false) {
                break;
            }
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
