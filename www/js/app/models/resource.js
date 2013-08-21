/**
 * This file is part of VertNet: https://github.com/VertNet/webapp
 * 
 * VertNet is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * VertNet is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Foobar.  If not, see: http://www.gnu.org/licenses
 */

// Defines the resource model.
define([
  'underscore',
  'backbone',
  'util'
], function (_, Backbone, util) {
  return Backbone.Model.extend({
    records: function() {
      return util.addCommas(this.get('count').toString());
    },

    nameSlug: function() {
      return util.slugify(this.get('title'));
    },

    descriptionSnip: function() {
      var des = this.get('description');
      if (des.length > 70) {
          if (des.slice(0, 70)[69] === ' ') {
            des = des.slice(0, 71) + '...';          
          } else {
            des = des.slice(0, 70) + '...';
          }
        }
      return des;
    },

    getDate: function() {
      var splits = this.get('pubdate').split(' ');
      return splits[1] + ' ' + splits[2] + ', ' + splits[5];
    }
  });
});
