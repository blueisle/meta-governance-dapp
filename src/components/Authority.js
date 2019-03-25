import React from 'react'
import { SubHeader } from './Nav'
import { AuthorityItem } from './AuthorityItem'
import { MiniLoader } from './BaseLoader';
import { constants } from '../ethereum/constants'
import './style/style.css'

class Authority extends React.Component {
    data = {
      authorityItems: [],
      visibleAuthorityItems: []
    }

    state = {
      getAuthorityInfo: false
    }

    constructor (props) {
      super(props)
      this.onSearchBtnClick = this.onSearchBtnClick.bind(this)
      this.onReadMoreClick = this.onReadMoreClick.bind(this)
      this.getAuthorityList = this.getAuthorityList.bind(this)

      this.textContainers = new Map()
    }

    componentDidMount () {
      this.getAuthorityList()
    }

    onSearchBtnClick (str) {
      str = str.toLowerCase()
      let authorityItems = []
      this.data.authorityItems.forEach((value) => {
        if (value.props.item.title.toLowerCase().indexOf(str) !== -1 || value.props.item.addr.toLowerCase().indexOf(str) !== -1) {
          authorityItems.push(value)
        }
      })
      this.data.visibleAuthorityItems = authorityItems
      this.setState({ getAuthorityInfo: true })
    }

    onApplyBtnClick () {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSfpSAevry4nqjljMACD1DhVzP8oU9J0OgvN49bGakofcZa49w/viewform?fbzx=2570300132786392930', '_blank')
    }

    onReadMoreClick (e, index) {
      const element = this.textContainers.get(index)
      if (element.offsetHeight === constants.authorityHeight) {
        element.style.height = 'auto'
        if(element.offsetHeight !== constants.authorityHeight) e.target.innerHTML = '- Read Less'
      }
      else {
        element.style.height = constants.authorityHeightToPixel
        e.target.innerHTML = '+ Read More'
      }
    }

    breakLine (description) {
      var regex = /(<br>)/g
      return description.split(regex).map((line, index) => line.match(regex) ? <br key={'key_' + index} /> : line)
    }

    getSNSList (snsList) {
      let sns = []
      for (var key in snsList) {
        let icon = null
        switch (key) {
          case 'twitter': icon = 'fab fa-twitter fa-2x'; break
          case 'medium': icon = 'fab fa-medium fa-2x'; break
          case 'facebook': icon = 'fab fa-facebook fa-2x'; break
          case 'instagram': icon = 'fab fa-instagram fa-2x'; break
          case 'telegram': icon = 'fab fa-telegram fa-2x'; break
          case 'linkedin': icon = 'fab fa-linkedin fa-2x'; break
          default: break
        }
        sns.push(<a key={key} className='snsGroup' href={snsList[key]}> <i className={icon} /> </a>)
      }

      /* Reversed. */
      sns.reverse()
      return sns
    }

    async getAuthorityList () {
      let list = []
      for (let i = 0; i < Object.keys(this.props.authorityOriginData).length; i++) {
        let item = this.props.authorityOriginData[i]
        let isMember = await this.props.contracts.governance.isMember(item.addr)
        if (isMember) {
          list.push(<AuthorityItem
            key={item.addr}
            item={item}
            index={i}
            textContainers={this.textContainers}
            breakLine={this.breakLine}
            onReadMoreClick={this.onReadMoreClick}
            getSNSList={this.getSNSList} />
          )
        }
      }
      this.data.authorityItems = list
      this.data.visibleAuthorityItems = list
      this.setState({ getAuthorityInfo: true })
    }

    render () {
      return (
        <div className='background'>
          <SubHeader
            netName={this.props.netName}
            placeholder='Search by Authority Name, Adress'
            btnText='Apply for Authority'
            btnFunction={this.onApplyBtnClick}
            searchFunction={this.onSearchBtnClick} />

          <div className='contentDiv container'>
            <div className='card_container'>
              {this.state.getAuthorityInfo
                ? this.data.visibleAuthorityItems
                : <MiniLoader/>
              }
            </div>
          </div>
        </div>
      )
    }
}
export { Authority }
