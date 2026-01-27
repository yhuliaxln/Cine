import React from 'react';

export default function DataGrid({
  data,
  columns,
  keyField = 'id',
  emptyMessage = 'No hay datos disponibles',
  onRowClick,
  actions = [],
  loading = false
}) {
  
  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={styles.th}>
                {column.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th style={styles.th}>Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr 
              key={item[keyField]} 
              style={styles.tr}
              onClick={() => onRowClick && onRowClick(item)}
              className={onRowClick ? 'clickable-row' : ''}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} style={styles.td}>
                  {column.render 
                    ? column.render(item[column.field], item)
                    : item[column.field]
                  }
                </td>
              ))}
              
              {actions.length > 0 && (
                <td style={styles.td}>
                  <div style={styles.actions}>
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(item);
                        }}
                        style={{
                          ...styles.actionBtn,
                          ...getActionStyle(action.type)
                        }}
                        title={action.label}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const getActionStyle = (type) => {
  switch(type) {
    case 'edit': return { backgroundColor: '#3b82f6', color: 'white' };
    case 'delete': return { backgroundColor: '#ef4444', color: 'white' };
    case 'view': return { backgroundColor: '#10b981', color: 'white' };
    case 'manage': return { backgroundColor: '#8b5cf6', color: 'white' };
    default: return { backgroundColor: '#6b7280', color: 'white' };
  }
};

const styles = {
  container: {
    width: '100%',
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: 'white'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px'
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f9fafb'
    }
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#4b5563'
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  actionBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    minWidth: '32px',
    height: '32px'
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#6b7280'
  },
  empty: {
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px dashed #d1d5db'
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '16px'
  }
};