import { fetchInventory, restockItem } from '../../api/inventoryApi';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { useApi } from '../../hooks/useApi';

export default function InventoryPanel() {
  const inventory = useApi(fetchInventory);
  if (inventory.loading) return <Loading />;
  if (inventory.error) return <ErrorMessage error={inventory.error} onRetry={inventory.reload} />;

  const lowCount = inventory.data.filter((item) => item.isLow).length;

  async function handleRestock(item) {
    await restockItem(item.itemId);
    inventory.reload();
  }

  return (
    <section className="panel" aria-labelledby="inventory-heading">
      <h2 id="inventory-heading">Inventory ({lowCount} low)</h2>
      <table className="data-table">
        <thead>
          <tr><th>Item</th><th>Vendor</th><th className="num">On hand</th><th className="num">Reorder at</th><th><span className="visually-hidden">Actions</span></th></tr>
        </thead>
        <tbody>
          {inventory.data.map((item) => (
            <tr key={item.itemId} className={item.isLow ? 'is-low' : ''}>
              <td>{item.name}{item.isLow && ' (low)'}</td>
              <td>{item.vendor}</td>
              <td className="num">{item.quantityOnHand} {item.unit}</td>
              <td className="num">{item.reorderLevel}</td>
              <td>
                <button className="btn" type="button" onClick={() => handleRestock(item)}>
                  Restock +{item.fillAmount}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
