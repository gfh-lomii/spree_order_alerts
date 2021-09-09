$(document).ready(function () {
  // add order style
  $('.badge-ready, .badge-pending').closest('[data-hook="admin_orders_index_rows"]').addClass('ready-order-row');

  const isAlertActive = !!localStorage.getItem('spree_order_alert');

  const is_order_index_page = document.querySelector('[data-hook="admin_orders_management"]')
  if(is_order_index_page) {
    const button = isAlertActive ? '<button class="btn btn-danger" id="disable_alert"> Desctivar Alerta</button>' : '<button class="btn btn-danger" id="active_alert"> Activar Alerta</button>'
    $('.page-actions').prepend(button);
  }

  if (isAlertActive) {
    activeNotification()
  }

  if (!!$('#listing_orders').length) {
    $('#disable_alert').one("click", function () {
      localStorage.removeItem('spree_order_alert');
      window.location.reload();
    });

    $('#active_alert').one("click", function () {
      localStorage.setItem('spree_order_alert', true);
      window.location.reload();
    });
  }
});

function activeNotification() {
  var stock_location = document.cookie.match(new RegExp('(^| )' + 'stock_location' + '=([^;]+)'));
  if (stock_location === null || stock_location === undefined) return;
  var st_id = stock_location === null ? '' : stock_location[2]
  var st_filter = st_id === '0' ? '' : '&q[search_by_stock_location_id]=' + st_id
  show_flash('success', 'Alerta activa');
  var orderAlert = {};
  orderAlert.appendSource = false;
  setInterval(function () {
    $.ajax({
      type: 'GET',
      url: Spree.url(Spree.routes.orders_api) +
        '?q[completed_at_gt]' +
        '&q[completed_at_lt]' +
        '&q[completed_at_not_null]=1&q[created_at_gt]' +
        '&q[created_at_lt]' +
         st_filter +
        '&q[s]=completed_at+desc&per_page=25',
      data: {
        token: Spree.api_key
      }
    }).done(function (data) {
      orderAlert.newOrder = false;
      data.orders.forEach(function (order) {
        var audio = document.getElementById("myAudio");
        if (order.payment_state === 'paid' && (order.shipment_state !== 'shipped' ||
          order.journey_state === null || order.journey_state === 'estimated' ||
          order.journey_state === 'hire' || order.journey_state === 'not found' ||
          order.journey_state === 'rider cancel' || order.journey_state === 'no show' ||
          order.journey_state === 'driver cancel')) {
          if (!orderAlert.appendSource) {
            $('body').append('<audio id="myAudio" style="display: none;" controls autoplay><source src="https://freesound.org/data/previews/171/171671_2437358-lq.mp3" crossorigin="anonymous" type="audio/mpeg"></audio>');
            orderAlert.appendSource = true;
          } else {
            show_flash('error', 'Nueva Orden '+order.number);
            audio.play();
            orderAlert.newOrder = true;
            // reload only on orders index page
            const is_order_index_page = document.querySelector('[data-hook="admin_orders_management"]')
            if(is_order_index_page) {
              setTimeout(() => {
                location.reload();
              }, 4000)
            }
          }
        } else if (data.orders.every(function (order) {
          return order.shipment_state === 'shipped'
        })) {
          show_flash('success', 'Todo tranqui');
        }
      })
    }).fail(function (message) {
      if (message && message.status !== 0)
        show_flash('error', message.statusText)
    })
  }, 6000);
}
