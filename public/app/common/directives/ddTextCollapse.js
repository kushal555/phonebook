  var app = angular.module("adminApp");

/**
 * @author Kushal Suthar
 * @ddTextCollapse directive
 * @name myapp.directive:ddTextCollapse
 * @restrict A
 * @scope
 * 
 *
 * @description
 * This used "dd-text-collapse" Directive for after some text it will return "..." OR "(more)" etc that as you want. You can simply customize this Directive. You can also make toggle read more and read less using this Directive.
 *
 * @example
   <div ng-app="mainApp" ng-controller="myController" id="mainController" class="container">
        <p dd-text-collapse dd-text-collapse-max-length="230" dd-text-collapse-text="{{ longText }}"></p>
    </div>
 */
  app.directive('ddTextCollapse', ['$compile', function($compile) {

      return {
          restrict: 'A',
          scope: true,
          link: function(scope, element, attrs) {

              /* start collapsed */
              scope.collapsed = false;

              /* create the function to toggle the collapse */
              scope.toggle = function() {
                  scope.collapsed = !scope.collapsed;
              };

              /* wait for changes on the text */
              attrs.$observe('ddTextCollapseText', function(text) {

                  /* get the length from the attributes */
                  var maxLength = scope.$eval(attrs.ddTextCollapseMaxLength);

                  if (text.length > maxLength) {
                      /* split the text in two parts, the first always showing */
                      var firstPart = String(text).substring(0, maxLength);
                      var secondPart = String(text).substring(maxLength, text.length);

                      /* create some new html elements to hold the separate info */
                      var firstSpan = $compile('<span>' + firstPart + '</span>')(scope);
                      var secondSpan = $compile('<span ng-if="collapsed">' + secondPart + '</span>')(scope);
                      var moreIndicatorSpan = $compile('<span ng-if="!collapsed">... </span>')(scope);
                      var lineBreak = $compile('<br ng-if="collapsed">')(scope);
                      var toggleButton = $compile('<span class="collapse-text-toggle" ng-click="toggle()">{{collapsed ? "(less)" : "(more)"}}</span>')(scope);

                      /* remove the current contents of the element
                       and add the new ones we created */
                      element.empty();
                      element.append(firstSpan);
                      element.append(secondSpan);
                      element.append(moreIndicatorSpan);
                      element.append(lineBreak);
                      element.append(toggleButton);
                  }
                  else {
                      element.empty();
                      element.append(text);
                  }
              });
          }
      };
  }]);