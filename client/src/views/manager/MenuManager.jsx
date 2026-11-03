import { useState } from 'react';
import { createMenuItem, fetchFullMenu, updateMenuItem } from '../../api/menuApi';
import { fetchOptions } from '../../api/optionsApi';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { useApi } from '../../hooks/useApi';
import { formatMoney } from '../../utils/money';
import MenuItemForm from './MenuItemForm';

const toPayload = ({ name, price, category, isAvailable }) => ({ name, price: Number(price), category, isAvailable });

export default function MenuManager() {
  const menu = useApi(fetchFullMenu);
  const options = useApi(fetchOptions);
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = adding

  if (menu.loading || options.loading) return <Loading />;
  if (menu.error || options.error) return <ErrorMessage error={menu.error ?? options.error} onRetry={menu.reload} />;

  async function handleSave(draft) {
    if (editing) await updateMenuItem(editing.productId, toPayload(draft));
    else await createMenuItem(toPayload(draft));
    setEditing(undefined);
    menu.reload();
  }

  const toggleAvailability = async (item) => {
    await updateMenuItem(item.productId, toPayload({ ...item, isAvailable: !item.isAvailable }));
    menu.reload();
  };

  return (
    <>
      {editing !== undefined && (
        <MenuItemForm key={editing?.productId ?? 'new'} item={editing} categories={options.data.categories}
                      onSave={handleSave} onCancel={() => setEditing(undefined)} />
      )}
      <section className="panel" aria-labelledby="menu-heading">
        <div className="panel__toolbar">
          <h2 id="menu-heading">Menu items ({menu.data.length})</h2>
          <button className="btn btn--primary" type="button" onClick={() => setEditing(null)}>Add item</button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Category</th><th className="num">Price</th><th>Status</th><th><span className="visually-hidden">Actions</span></th></tr>
          </thead>
          <tbody>
            {menu.data.map((item) => (
              <tr key={item.productId} className={item.isAvailable ? '' : 'is-hidden'}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td className="num">{formatMoney(item.price)}</td>
                <td>{item.isAvailable ? 'On menu' : 'Hidden'}</td>
                <td>
                  <button className="btn" type="button" onClick={() => setEditing(item)}>Edit</button>{' '}
                  <button className="btn" type="button" onClick={() => toggleAvailability(item)}>
                    {item.isAvailable ? 'Hide' : 'Show'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
