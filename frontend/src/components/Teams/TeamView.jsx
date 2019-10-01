import React from 'react';
// import axios from 'axios';
// import { Redirect } from 'react-router-dom';
import Teams from './Teams';
// import { Form, Segment, Label, Input, Message, } from 'semantic-ui-react';
import { Form, Segment, Label, Input } from 'semantic-ui-react';
import Store from '../../Store';

// class TeamCreate extends React.Component {
class TeamView extends Teams {

  constructor (props) {
    super(props);

    this.state = { 
      term: '',
      team: '',
      teamId: 0
    };

    this.teams = [];
    this.teamsAll = [];

  }

  static contextType = Store;

  componentDidMount() {
    console.log(this.context);

    const gt = async (type) => {
      let ret;
      try { 
        ret = await this._getTeams(type); 
        switch(type) {
          case 'forSelect':
            this.teams = ret;
            this.teams.sort( (a, b) => { return (a.text.toLowerCase() < b.text.toLowerCase()) ? -1 : 1; } ); 
            this.setState( () => { return { 
              team: this.teams[0].text,
              teamId:  this.teams[0].key
            }; } );
            // console.log('1->', this.teams);
            break;
          case 'all':
            this.teamsAll = ret;
            // console.log('2->', this.teamsAll);
            break;
          default:
            break;
        }
      }
      catch (e) { console.log('Coś nie tak', e.errmsg); };
    }
    gt('forSelect');
    gt('all');

  }

  onSelectChange = (e, { value, name }) => {
// console.log( this.teams[ this.teams.map( (el) => { return el.value; } ).indexOf(value) ].key );
    this.setState( () => { return { 
      team: value,
      errHeader: '',
      errMessage: '',
      teamId: this.teams[ this.teams.map( (el) => { return el.value; } ).indexOf(value) ].key
    }})
  }

  onFormSubmit = (e, d) => {
    e.preventDefault();
  }

  render() {
    return (
      <Segment.Group horizontal width={12}>
        <Segment width={2}>
          <Form onSubmit={this.onFormSubmit}></Form>
            <Form.Group>
              <Form.Field>
                <Label>Zgłoszone drużyny</Label>
                {/* <Form.Group> */}
                  <Form.Dropdown 
                    key="teamsSelect"
                    name="teamsSelect"
                    // placeholder="puknij gracza nr 1..."    // potrzebne, kiedy nie ma domyślnej wartości
                    selection value={this.state.team} 
                    options={ this.teams } 
                    onChange={ (e, v) => this.onSelectChange(e, v) } 
                  />
                {/* </Form.Group> */}
              </Form.Field>
            </Form.Group>
        </Segment>
        <Segment width={10}>
          <Input 
            label="_id"
            value={ this.state.teamId } 
            disabled
          />
        </Segment>
      </Segment.Group>
    )
  };
}

export default TeamView;