let id=0;
let ContactsLib;
let update = function(){
  $.ajax({
      url: 'http://contactbookdt.azurewebsites.net/api/contact/',
      type: 'GET',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: false,
      success: function(msg) {
        ContactsLib = data;
        ContactsLib.forEach(function(item, i, arr){
            if (id<item.id){
                id = item.id;
            }
        });
        id++;
        ReactDOM.render(<ContactBlock contacts={ContactsLib}/>, document.getElementById('list'));
      }
  });
}
/*let update = function(){
    $.getJSON('http://contactbookdt.azurewebsites.net/api/contact', function(data){
            ContactsLib = data;
            ContactsLib.forEach(function(item, i, arr){
                if (id<item.id){
                    id = item.id;
                }
            });
            id++;
            ReactDOM.render(<ContactBlock contacts={ContactsLib}/>, document.getElementById('list'));
});
}*/

update();

let ContactBlock = React.createClass({
    render: function(){
        let contactComponents = this.props.contacts.map(function(contact) {
            return(
                <li className="contact" id={contact.id} key={contact.id}>
                    <img src="default.jpg" />
                    <div className="contact-info">
                        <h3>{contact.surname} {contact.name.split('')[0]}.</h3>
                        <p>{contact.number}</p>
                    </div>
                </li>
            )
        })
        return <div>{contactComponents}</div>;
    }
});

let CardBlock = React.createClass({
    getInitialState: function(){
        return {
                name: null,
                surname: null,
                id: null,
                email: null,
                surname: null,
                number: null,
                secondName: null
        }
    },
    componentWillMount: function(){
        if(this.props.library!=undefined){
            for (let i=0; i<this.props.library.length; i++){
                if (this.props.library[i].id == this.props.id){
                    this.setState({
                        name: this.props.library[i].name,
                        surname: this.props.library[i].surname,
                        id: "delete_"+this.props.id,
                        email: this.props.library[i].email,
                        number: this.props.library[i].number,
                        secondName: this.props.library[i].secondName
                })
                }
            }
        }
    },
    render: function(){
        return ( <div className="contact-card" id="active-card">
        <h1>Карточка клиента:</h1>
                    <div className="mi-left">
                        <input className="photo-uploader" type="image" src="default.jpg" />
                    </div>
                    <div className="mi-right">
                        <ul className="mir-left">
                            <li>Фамилия:</li>
                            <li>Имя:</li>
                            <li>Отчество:</li>
                        </ul>
                        <ul className="mir-right">
                           <li><input type="text" className="input_surname" readOnly/></li>
                           <li><input type="text" className="input_name" readOnly/></li>
                           <li><input type="text" className="input_secondName" readOnly/></li>
                        </ul>
                    </div>
                    <div className="bottom-info">
                        <label className="ai-label">Почта:</label>
                        <input type="text" className="add-info input_email" readOnly/>
                        <label className="ai-label">Телефон:</label>
                        <input type="text" className="add-info input_number" readOnly/>
                        <div id="btn-house"></div>
                    </div>
                    </div>
        )
    },
    componentDidMount: function(){
        if(this.state.name){
            $('.input_name').val(this.state.name);
            $('.input_email').val(this.state.email);
            $('.input_secondName').val(this.state.secondName);
            $('.input_number').val(this.state.number);
            $('.input_surname').val(this.state.surname);
            $('.input_email').val(this.state.email);
        } else {
            $('.contact-card input').removeAttr('readOnly');
        }
    }
});

let DeleteButton = React.createClass({
    getInitialState: function(){
        return {
            id: 'delete_'+this.props.id
        }
    },
    render: function(){
        return <button className="delete" id={this.state.id}>Удалить контакт</button>;
    }
});

let AddButton = React.createClass({
    render: function(){
        return <button className="add">Добавить контакт</button>
    }
});

$(document).on('click', '.contact', function(){
    $('#right-part').empty();
    $('.active-contact').removeClass('active-contact');
    $(this).addClass('active-contact');
    let id_temp = $(this).attr('id');
    ReactDOM.render(<CardBlock id={id_temp} library={ContactsLib}/>, document.getElementById('right-part'));
    ReactDOM.render(<DeleteButton id={id_temp}/>, document.getElementById('btn-house'));
});

$('#plus').on('click', function(){
    $('#right-part').empty();
    $('.active-contact').removeClass('active-contact');
    ReactDOM.render(<CardBlock />, document.getElementById('right-part'));
    ReactDOM.render(<AddButton />, document.getElementById('btn-house'));
});

$(document).on('click', '.delete', function(){
    let id = $(this).attr('id').split('_')[1];
    let url_temp = 'https://contactbookdt.azurewebsites.net/api/contact/'+id;
    $.ajax({
       url: url_temp,
        type: 'DELETE',
        async: false,
        success: function(msg) {
            $('#right-part').empty();
            update();
        }
   });
});

$(document).on('click', '.add', function(){
    let data = {
        name: $('.input_name').val(),
        secondName: $('.input_secondName').val(),
        surname: $('.input_surname').val(),
        id: id,
        email: $('.input_email').val(),
        number: $('.input_number').val()
    }
    id++
    $.ajax({
        url: 'https://contactbookdt.azurewebsites.net/api/contact/',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function(msg) {
            update();
            $('#right-part').empty();
        }
    });
});

$(document).keypress(function(e){
    if(e.keyCode == 27){
        $('.active-contact').removeClass('active-contact');
        $('#right-part').empty();
    }
});

$('#search-input').on('keyup', function(){
    $('#list').empty();
    let search_text = $('#search-input').val().toLowerCase();
    let BlockNew = [];
    for (let i=0; i<ContactsLib.length; i++){
        let temp = [];
        let temp2 = ContactsLib[i].surname.toLowerCase().split('');
        temp = temp2.splice(search_text.length, temp2.length-search_text.length);
        if (search_text==temp2.join('')){
            BlockNew.push(ContactsLib[i]);
        }
    }
        ReactDOM.render(<ContactBlock contacts={BlockNew}/>, document.getElementById('list'));
});
