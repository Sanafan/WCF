<?php
namespace wcf\data\search\keyword;
use wcf\data\AbstractDatabaseObjectAction;
use wcf\data\ISearchAction;
use wcf\system\WCF;

/**
 * Executes keyword-related actions.
 * 
 * @author	Marcel Werk
 * @copyright	2001-2019 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\Data\Search\Keyword
 * 
 * @method	SearchKeyword		create()
 * @method	SearchKeywordEditor[]	getObjects()
 * @method	SearchKeywordEditor	getSingleObject()
 */
class SearchKeywordAction extends AbstractDatabaseObjectAction implements ISearchAction {
	/**
	 * @inheritDoc
	 */
	protected $className = SearchKeywordEditor::class;
	
	/**
	 * @inheritDoc
	 */
	protected $allowGuestAccess = ['getSearchResultList'];
	
	/**
	 * @inheritDoc
	 */
	public function validateGetSearchResultList() {
		$this->readString('searchString', false, 'data');
	}
	
	/**
	 * @inheritDoc
	 */
	public function getSearchResultList() {
		$list = [];
		
		// find users
		$sql = "SELECT		*
			FROM		wcf".WCF_N."_search_keyword
			WHERE		keyword LIKE ?
			ORDER BY	searches DESC";
		$statement = WCF::getDB()->prepareStatement($sql, 10);
		$statement->execute([$this->parameters['data']['searchString'].'%']);
		while ($row = $statement->fetchArray()) {
			$list[] = [
				'label' => $row['keyword'],
				'objectID' => $row['keywordID']
			];
		}
		
		return $list;
	}
	
	/**
	 * Inserts a new keyword if it does not already exist, or updates it if it does.
	 */
	public function registerSearch() {
		$sql = "INSERT INTO             wcf".WCF_N."_search_keyword
						(keyword, searches, lastSearchTime)
			VALUES                  (?, ?, ?)
			ON DUPLICATE KEY UPDATE searches = searches + VALUES(searches),
						lastSearchTime = VALUES(lastSearchTime)";
		$statement = WCF::getDB()->prepareStatement($sql);
		$statement->execute([
			mb_substr($this->parameters['data']['keyword'], 0, 191),
			($this->parameters['data']['searches'] ?? 1),
			($this->parameters['data']['lastSearchTime'] ?? TIME_NOW),
		]);
	}
}
