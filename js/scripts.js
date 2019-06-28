(function () {
  var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=152';

  function add(pokemon) {
    if (typeof pokemon === "object") {
      repository.push(pokemon);
    } 
  }
 
  function getAll() {
    return repository;
  }

  function loadList() {
  return $.ajax(apiUrl).then(function (response) {
      response.results.forEach(function(item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url).then(function (response){
      item.imageUrl = response.sprites.front_default;
      item.height = response.height;
      item.types = [];
      response.types.forEach(function(type) {
        item.types.push(type.type.name);
      });
    }).catch(function (e) {
      console.error(e);
    });
  }

  function addListItem(pokemon) {
    var $list = $('.pokemon-list');
    var $listItem = $('<li class="pokemon-list__item"></li>');
    var $button = $('<button class="pokemon-list__button">' + pokemon.name + '</button>');
    
    $listItem.append($button);
    $list.append($listItem);

    // Show pokemon details when click on the button with its name
    $button.on('click', function() {
      showDetails(pokemon);
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      showModal(item);
    });
  }

  var $modalContainer = $('#modal-container');

  function showModal(item) {
    //Show pokemon name 
    $('h2').text(item.name); 
    
    //Show pokemon height
    $('.text-green').text(`Height: ${item.height}m`);
   
    var typesDescription = $('.text-black span');
    typesDescription.empty();

    //Show types, each to have a different color
    $(item.types).each(function (type) {
      var typeSpan = $(`<span class="${this}">${this} </span>`);
      typesDescription.append(typeSpan);
    });
     //Show pokemon image 
    $('.pokemon-image').attr('src', item.imageUrl).attr('alt', `image of ${item.name}`);
    
    $modalContainer.addClass('is-visible');
  }

  function hideModal() {
    $modalContainer.removeClass('is-visible');
  }
  
   //Close modal by pressing on Close button
   $('.modal-close').on('click', hideModal);

  // Close modal on pressing Esc button
  $(window).on('keydown', (e) => {
    if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

  //Close modal on pressing outside the main modal box 
  $modalContainer.on('click', (e) => {
    var target = e.target;
    if (target === $modalContainer[0]) {
      hideModal();
    }
  });

  // Search bar 
  var searchBar = $('#search-bar');
  searchBar.on("input", filterPokemon);

  function filterPokemon(e) {
    var text = e.target.value.toLowerCase();
    $('.pokemon-list__item').each(function ( i ) {
      var item = $(this).get(0).textContent;
      if( item.toLowerCase().indexOf(text.toLowerCase()) === -1) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
}) ();
