import Link from 'next/link'
import { productCategories } from '@/content/productCategories'
import { ArrowIcon } from './ArrowIcon'

export function ProductCategoryGrid() {
  return (
    <div className="category-grid">
      {productCategories.map((category, index) => (
        <article className={`category-card category-${category.accent}`} key={category.id}>
          <div className="category-index">0{index + 1}</div>
          <div className="category-visual" aria-hidden="true"><span /><i /><b /></div>
          <p className="eyebrow">{category.eyebrow}</p>
          <h3>{category.name}</h3>
          <p className="category-description">{category.description}</p>
          <div className="tag-list">{category.applications.map((item) => <span key={item}>{item}</span>)}</div>
          {category.children ? <div className="subcategories">{category.children.map((item) => <Link href={`/products/category/${item.id}`} key={item.id}>{item.name}</Link>)}</div> : null}
          <Link className="text-link" href={`/products/category/${category.id}`}>查看系列 <ArrowIcon /></Link>
        </article>
      ))}
    </div>
  )
}

