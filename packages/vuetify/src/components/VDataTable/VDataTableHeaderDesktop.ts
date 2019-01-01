// Helpers
import { VNode } from 'vue'
import mixins from '../../util/mixins'
import header from './mixins/header'
import { getTextAlignment } from '../../util/helpers'

export default mixins(header).extend({
  name: 'v-data-table-header-desktop',

  methods: {
    genHeaders () {
      return this.headers.map(header => {
        const listeners: any = {}
        const children = []

        let classes = {
          [getTextAlignment(header.align, this.$vuetify.rtl)]: true
        }

        if (header.value === 'dataTableSelect') {
          children.push(this.genSelectAll())
        } else {
          if (this.$scopedSlots[header.value]) {
            children.push(this.$scopedSlots[header.value]!({ header }))
          } else {
            children.push(this.$createElement('span', [header.text]))
          }

          if (header.sortable || !header.hasOwnProperty('sortable')) {
            listeners['click'] = () => {
              this.$emit('sort', header.value)
            }

            const sortIndex = this.options.sortBy.findIndex(k => k === header.value)
            const beingSorted = sortIndex >= 0
            const isDesc = this.options.sortDesc[sortIndex]

            classes = {
              ...classes,
              'sortable': true,
              'active': beingSorted,
              'asc': beingSorted && !isDesc,
              'desc': beingSorted && isDesc
            }

            if (header.align === 'end') children.unshift(this.genSortIcon())
            else children.push(this.genSortIcon())

            if (this.options.multiSort && beingSorted) {
              children.push(this.$createElement('span', { class: 'badge' }, [String(sortIndex + 1)]))
            }
          }

          if (this.dataTable.showGroupBy) {
            children.push(this.$createElement('span', {
              on: {
                click: () => this.$emit('group', header.value)
              }
            }, ['group']))
          }
        }

        return this.$createElement('th', {
          class: classes,
          on: listeners
        }, children)
      })
    }
  },

  render (): VNode {
    return this.$createElement('thead', {
      staticClass: 'v-data-table-header'
    }, [
      this.$createElement('tr', this.genHeaders())
    ])
  }
})